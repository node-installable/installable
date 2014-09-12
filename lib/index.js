'use strict';
var hapi = require('hapi'),
    matchdep = require('matchdep'),
    async = require('async'),
    colors = require('colors'),
    webpack = require('webpack');

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
        this.server.stop(function () {
            console.log('[Installable] Server stopped.');
            Installable.startServer();
        });
    },
    startServer: function (config, pkgPath) {
        this.config = config = this.config || config;
        this.pkgPath = pkgPath = this.pkgPath || pkgPath;

        // start server with app's config
        var server = this.server = hapi.createServer(
            'localhost',
            process.env.PORT || config.server.port || 3000,
            config.server
        );

        // mount routes
        server.route(config.routes);

        // reload package.json cause it might have changed (on restart)
        delete require.cache[pkgPath];

        var pkg = require(pkgPath);

        var applicationName = pkg.name;

        var plugins = matchdep
            .filter(
                applicationName + '-plugin-*',
                pkg
            )
            .map(function (pluginName) {
                return {
                    plugin: require(process.cwd() + '/node_modules/' + pluginName),
                    name: pluginName.replace(/([a-z_\d]+-){2}/i, ''),
                    fullName: pluginName
                };
            }
        );

        console.log('[Installable] %s plugins found'.info, plugins.length);

        var tasks = [];

        if (plugins.length) {
            var pluginsPath = (config.installable && config.installable.pluginsPath) || '/plugins/';
            console.log('[Installable] Loading plugins under path %s'.info, pluginsPath);
            tasks = plugins.map(function (plugin) {
                return function (callback) {
                    server.pack.register(
                        plugin,
                        {
                            route: {
                                prefix: pluginsPath + plugin.name
                            }
                        },
                        function (error) {
                            if (error) {
                                callback(error);
                            } else {
                                console.log(
                                    ('[Installable] Successfully' +
                                     ' registered plugin %s').info,
                                    plugin.fullName
                                );

                                callback();
                            }
                        }
                    );
                };
            });
        }

        tasks.push(function (callback) {
            server.pack.register(
                {
                    plugin: require('./api/plugin'),
                    name: 'installable-modules'
                },
                {
                    route: {
                        prefix: '/installable'
                    }
                },
                function (error) {
                    if (error) {
                        callback(error);
                    } else {
                        console.log(
                            ('[Installable] Successfully' +
                             ' registered installable modules controller').info
                        );

                        callback();
                    }
                }
            );
        });

        async.series(tasks, function (error) {
            if (error) {
                throw error;
            }

            server.start(function () {
                console.log('[Installable] Web server started %s'.info,
                    server.info.uri);
            });
        });

        return server;
    }
};


module.exports = Installable;
