'use strict';
var matchdep = require('matchdep');
var Router = require('express').Router;
var debug = require('debug')('installable');

var apiRoutes = require('./api/routes');

/**
 * Installable
 * @constructor
 * @param {Object} app     [express app]
 * @param {String} pkgPath [path for app's package.json]
 * @param {Function} builder - builds the front end
 */
function Installable (app, pkgPath, builder) {
    this.app = app;
    this.pkgPath = pkgPath;
    this.builder = builder;
    this.projectRoot = pkgPath.replace('package.json', '');
    this.appName = require(pkgPath).name;
    this.pluginsRegExp = new RegExp(this.appName + '-plugin-.+');
    this.sockets = [];
}

/**
 * Builds front end application. Usually called after a plugin
 * is installed or uninstalled to add/remove its functionality
 * to the front end.
 * @param  {Function} cb [callback]
 * @public
 */
Installable.prototype.build = function (cb) {
    this.builder(require(this.projectRoot + 'client/config/webpack.config'), cb);
};

/**
 * Mounts installable and plugins routes, registers error handler
 * and then starts the http server.
 * @param  {Function} cb [callback when server starts listening]
 * @return {http.Server}
 * @public
 */
Installable.prototype.startServer = function (cb) {
    this.mountInstallableRoutes();
    this.mountPluginsRoutes();

    // register error handlers after ALL other routes
    this.registerErrorHandler();

    return this.startListening(cb);
};

/**
 * Restarts Application. First shut down the server
 * and then process exits with a restart error code.
 * @public
 */
Installable.prototype.restartApplication = function () {
    this.stopServer(function () {
        debug('Worker pid[%s] sending restart command to cluster.'.info, process.pid);
        process.send({command: 'restart'});
    });
};

/**
 * Stops servers and all open sockets.
 * @public
 */
Installable.prototype.stopServer = function (cb) {
    if (this.server) {
        debug('Stopping server...'.info);
        this.destroyAllSockets();
        this.server.close(function (err) {
            debug('Server stopped.'.info);
            cb(err);
        }.bind(this));
    } else {
        debug('No server to stop.'.info);
        cb(new Error('No server to stop.'));
    }
};

/**
 * Starts http server
 * @param  {Function} cb [callback when server starts listening]
 * @return {http.Server}
 * @private
 */
Installable.prototype.startListening = function (cb) {
    var port = this.app.get('port');
    this.server = this.app.listen(port, function (err) {
        if (err) {
            debug('Express server failed to start. Error %s'.error, err);
            cb(err);
        } else {
            debug('Express server listening on port %s'.info, port);
            cb(null, this.server);
        }
    }.bind(this));

    this.server.on('connection', this.addSocket.bind(this));

    return this.server;
};

/**
 * Mounts Installable plugins API routes
 * @private
 */
Installable.prototype.mountInstallableRoutes = function () {
    this.app.use('/installable', apiRoutes(this));
};

/**
 * Registers error handler if set
 * @private
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
 * @private
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
 * @private
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
 * @private
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
 * @private
 */
Installable.prototype.destroyAllSockets = function () {
    this.sockets.forEach(function (socket) {
        socket.destroy();
    });
    this.sockets = [];
};


module.exports = Installable;
