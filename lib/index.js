'use strict';
var matchdep = require('matchdep');
var colors = require('colors');
var webpack = require('webpack');
var Router = require('express').Router;

var installableRoutes = require('./api/routes');

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    info: 'grey',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
    success: 'green',
    highlight: 'cyan'
});

var Installable = {
    build: function (callback) {
        webpack(
            require(process.cwd() + '/webpack.config'),
            function (error) {
                if (error) {
                    return callback(error);
                }
                callback(null);
            }
        );
    },
    restartServer: function () {
        console.log('[Installable] Stopping server...'.info);
        forceCloseAllConnections();
        this.server.close(function () {
            console.log('[Installable] Server stopped.'.info);
            Installable.startServer();
        });
    },
    startServer: function (app, pkgPath) {
        this.pkgPath = this.pkgPath || pkgPath;
        this.app = this.app || app;
        app = app || this.app;

        // mount installable routes (static + api)
        app.use('/installable', installableRoutes);

        // reload package.json cause it might have changed (on restart)
        delete require.cache[this.pkgPath];

        // find plugins and load their routes
        var pkg = require(this.pkgPath);
        var plugins = matchdep.filter(pkg.name + '-plugin-*', pkg);

        console.log('[Installable] %s plugins found'.info, plugins.length);

        if (plugins.length) {
            var pluginsPath = app.get('pluginsPath') || '/plugins/';
            console.log('[Installable] Loading plugins under path %s'.info, pluginsPath);

            plugins.forEach(function (pluginName) {
                var router = Router();
                require(
                    process.cwd() + '/node_modules/' +
                    pluginName + '/server/src/config/routes'
                )(router);

                var pluginPath = pluginsPath + pluginName.replace(/([a-z_\d]+-){2}/i, '');
                app.use(pluginPath, router);
                console.log('[Installable] Loaded path %s'.info, pluginPath);
            });
        }

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
            var err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        // if user has set an error handler use it
        if (app.get('errorHandler')) {
            app.use(app.get('errorHandler'));
        }

        app.set('port', process.env.PORT || 3000);

        this.server = app.listen(app.get('port'), function() {
            console.log('[Installable] Express server listening on port %s'.info,
                this.server.address().port);
        }.bind(this));

        this.server.on('connection', addSocket);
    }
};

var sockets = [];

function addSocket (socket) {
    socket.setTimeout(4000);
    sockets.push(socket);
    socket.on('close', function () {
        sockets.splice(sockets.indexOf(socket), 1);
    });
}

function forceCloseAllConnections () {
    sockets.forEach(function (socket) {
        socket.destroy();
    });
    sockets = [];
}

module.exports = Installable;
