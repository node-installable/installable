'use strict';

var npm = require('npm'),
    Hapi = require('hapi'),
    matchdep = require('matchdep'),
    Installable = require('./../index');

var appName = require(process.cwd() + '/package.json').name;

exports.search = function (request, reply) {
    npm.load(null, function (error) {
        if (error) {
            return reply(Hapi.error.internal('Failed to load npm', error));
        }

        if (request.params.term && request.params.term.length) {
            npm.commands.search(
                [request.params.term, appName + '-plugin'],
                function (error, data) {
                    if (error) {
                        return reply({error: error});
                    }

                    reply(data);
                }
            );
        } else {
            reply(Hapi.error.badRequest('No search term given'));
        }
    });
};

exports.install = function (request, reply) {
    npm.load(null, function (error) {
        if (error) {
            return reply(Hapi.error.internal('Failed to load npm', error));
        }

        if (request.params.module && request.params.module.length) {
            npm.config.set('save', true);
            npm.commands.install(
                [request.params.module],
                function (error) {
                    if (error) {
                        return reply({error: error});
                    }

                    Installable.build(function (error) {
                        if (error) {
                            return reply(Hapi.error.internal('Failed to build app', error));
                        }

                        reply({ok: true});
                        Installable.restartServer();
                    });
                }
            );
        } else {
            reply(Hapi.error.badRequest('No module name given'));
        }
    });
};

exports.uninstall = function (request, reply) {
    npm.load(null, function (error) {
        if (error) {
            return reply(Hapi.error.internal('Failed to load npm', error));
        }

        if (request.params.module && request.params.module.length) {
            npm.config.set('save', true);
            npm.commands.uninstall(
                [request.params.module],
                function (error) {
                    if (error) {
                        return reply({error: error});
                    }

                    Installable.build(function (error) {
                        if (error) {
                            return reply(Hapi.error.internal('Failed to build app', error));
                        }

                        reply({ok: true});
                        Installable.restartServer();
                    });
                }
            );
        } else {
            reply(Hapi.error.badRequest('No module name given'));
        }
    });
};


exports.list = function (request, reply) {
    var pkg = require(process.cwd() + '/package.json');
    var plugins = matchdep
        .filter(pkg.name + '-plugin-*', pkg)
        .map(function (pluginName) {
            return {
                name: pluginName,
                version: pkg.dependencies[pluginName]
            };
        });

    reply(plugins);
};
