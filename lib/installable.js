'use strict';
var matchdep = require('matchdep');
var webpack = require('webpack');
var Router = require('express').Router;
var debug = require('debug')('installable');

var apiRoutes = require('./api/routes');
var EXIT_CODES = require('./exit_codes');

/**
 * Installable constructor
 * @param {Object} app     [express app]
 * @param {String} pkgPath [path for app's package.json]
 */
function Installable (app, pkgPath) {
    this.app = app;
    this.pkgPath = pkgPath;
    this.projectRoot = pkgPath.replace('package.json', '');
    this.appName = require(pkgPath).name;
    this.pluginsRegExp = new RegExp(this.appName + '-plugin-.+');
    this.sockets = [];
}

/**
 * Builds front end application. Usually called after a plugin
 * is installed or uninstalled to add/remove its functionality
 * to the front end.
 * @param  {Function|undefined} cb [callback]
 * @api public
 */
Installable.prototype.build = function (cb) {
    webpack(
        require(this.projectRoot + 'client/config/webpack.config'),
        function (error) {
            if (error) {
                return cb(error);
            }
            cb(null);
        }
    );
};

/**
 * Restarts Server. First shut down the server and all
 * open sockets and then process exits with a restart error code.
 * @api public
 */
Installable.prototype.restartServer = function () {
    if (this.server) {
        debug('Stopping server...'.info);
        this.destroyAllSockets();
        this.server.close(function () {
            debug('Server stopped.'.info);
            process.exit(EXIT_CODES.RESTART);
        }.bind(this));
    } else {
        debug('No server to stop.'.info);
    }
};

/**
 * Mounts installable and plugins routes, registers error handler
 * and then starts the http server.
 * @param  {Function} cb [callback when server starts listening]
 * @return {http.Server}
 * @api public
 */
Installable.prototype.startServer = function (cb) {
    this.mountInstallableRoutes();
    this.mountPluginsRoutes();

    // register error handlers after ALL other routes
    this.registerErrorHandler();

    return this.startListening(cb);
};

/**
 * Starts http server
 * @param  {Function} cb [callback when server starts listening]
 * @return {http.Server}
 * @api private
 */
Installable.prototype.startListening = function (cb) {
    var port = this.app.get('port');
    this.server = this.app.listen(port, function (err) {
        debug('Express server listening on port %s'.info, this.server.address().port);

        if (cb) {
            if (err) {
                cb(err);
            } else {
                cb(this.server);
            }
        }
    }.bind(this));

    this.server.on('connection', this.addSocket.bind(this));

    return this.server;
};

/**
 * Mounts Installable plugins API routes
 * @api private
 */
Installable.prototype.mountInstallableRoutes = function () {
    this.app.use('/installable', apiRoutes(this));
};

/**
 * Registers error handler if set
 * @api private
 */
Installable.prototype.registerErrorHandler = function () {
    // catch 404 and forward to error handler
    this.app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

    // if user has set an error handler use it
    var errorHandler = this.app.get('errorHandler');
    if (errorHandler) {
        this.app.use(errorHandler);
    }
};

/**
 * Mounts plugins routes
 * @api private
 */
Installable.prototype.mountPluginsRoutes = function () {
    // reload package.json cause it might have changed (on restart)
    delete require.cache[this.pkgPath];

    // find plugins and load their routes
    var pkg = require(this.pkgPath);
    var plugins = matchdep.filter(pkg.name + '-plugin-*', pkg);

    debug('%s plugins found'.info, plugins.length);

    if (plugins.length) {
        var pluginsPath = this.app.get('pluginsPath');

        if (!pluginsPath) {
            pluginsPath = '/plugins/';
            this.app.set('pluginsPath', pluginsPath);
        }

        if (!pluginsPath.match(/\/$/)) {
            pluginsPath = pluginsPath + '/';
            this.app.set('pluginsPath', pluginsPath);
        }

        debug('Loading plugins under path %s'.info, pluginsPath);

        plugins.forEach(this.mountPluginRoutes.bind(this));
    }
};

/**
 * Mounts a plugin's routes
 * @param {String} pluginName [plugin module name]
 * @api private
 */
Installable.prototype.mountPluginRoutes = function (pluginName) {
    try {
        var router = Router();
        require(
            this.projectRoot + 'node_modules/' +
            pluginName + '/server/src/config/routes'
        )(router);

        var pluginPath = this.app.get('pluginsPath') +
            pluginName.replace(/([a-z_\d]+-){2}/i, '');

        this.app.use(pluginPath, router);
        debug('Loaded path %s for plugin %s'.info, pluginPath, pluginName);
    } catch (e) {
        debug('Routes not found for plugin %s. Error: %s'.warn, pluginName, e.message);
    }
};

/**
 * Keeps references of all active sockets
 * so that they can been destroyed immediatelly
 * if we want to shut down the server
 * @param {net.Socket} socket
 * @api private
 */
Installable.prototype.addSocket = function (socket) {
    this.sockets.push(socket);
    socket.on('close', function () {
        this.sockets.splice(this.sockets.indexOf(socket), 1);
    }.bind(this));
};

/**
 * Destroys all active sockets so that the server
 * can shutdown immediately
 * @api private
 */
Installable.prototype.destroyAllSockets = function () {
    this.sockets.forEach(function (socket) {
        socket.destroy();
    });
    this.sockets = [];
};


module.exports = Installable;
