'use strict';
var hapi = require('hapi'),
    matchdep = require('matchdep'),
    async = require('async'),
    colors = require('colors');

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
    startServer: function (config, pkg) {
        // start server with app's config
        var server = hapi.createServer(
            'localhost',
            process.env.PORT || config.server.port || 3000,
            config.server
        );

        // mount routes
        server.route(config.routes);

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

        if (plugins.length) {
            console.log('[Installable] %s plugins found'.info, plugins.length);
            var tasks = plugins.map(function (plugin) {
                return function (callback) {
                    server.pack.register(
                        plugin,
                        {
                            route: {
                                prefix: '/plugins/' + plugin.name
                            }
                        },
                        function (err) {
                            if (err) {
                                callback(err);
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

            async.series(tasks, function (err) {
                if (err) {
                    throw err;
                }

                server.start(function () {
                    console.log('[Installable] Web server started %s'.info,
                        server.info.uri);
                });
            });

        } else {
            console.log('[Installable] No plugins found'.info);
            server.start(function () {
                console.log('[Installable] Web server started %s'.info,
                    server.info.uri);
            });
        }

        return server;
    }
};


module.exports = Installable;
