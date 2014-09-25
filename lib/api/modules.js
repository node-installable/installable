'use strict';
var npm = require('npm');
var matchdep = require('matchdep');
var _ = require('lodash');

var appName = require(process.cwd() + '/package.json').name;

exports.search = function (req, res) {
    npm.load(null, function (error) {
        if (error) {
            return res.status(error.statusCode)
                        .json(
                            _.extend({error:'Failed to load npm'}, error)
                        );
        }

        var terms = [appName + '-plugin'];

        if (req.query.term && req.query.term.length) {
            terms.push(req.query.term);
        }

        console.log('[Installable] Search started. Terms: %j '.info, terms);

        npm.commands.search(
            terms,
            function (error, data) {
                if (error) {
                    console.log('[Installable] Search returned error: %j'.error, error);
                    return res.status(error.statusCode)
                                .json(
                                    _.extend({error:'npm search failed'}, error)
                                );
                }

                var modules = _.values(data);

                console.log('[Installable] Search returned success: %s results'.info,
                    modules.length);

                res.json(modules);
            }
        );
    });
};

exports.install = function (req, res) {
    npm.load(null, function (error) {
        if (error) {
            return res.status(error.statusCode)
                        .json(
                            _.extend({error:'Failed to load npm'}, error)
                        );
        }

        if (req.params.module && req.params.module.length) {
            npm.config.set('save', true);
            npm.commands.install(
                [req.params.module],
                function (error) {
                    if (error) {
                        console.error('[Installable] npm install returned error: %j'.error, error);
                        return res.status(error.statusCode)
                                    .json(
                                        _.extend({error:'npm install failed'}, error)
                                    );
                    }

                    installable().build(function (error) {
                        if (error) {
                            return res.status(error.statusCode)
                                .json(
                                    _.extend({error:'Failed to build app'}, error)
                                );
                        }

                        res.json({ok: true});
                        installable().restartServer();
                    });
                }
            );
        } else {
            res.status(400).json({error: 'No module name given'});
        }
    });
};

exports.uninstall = function (req, res) {
    npm.load(null, function (error) {
        if (error) {
            return res.status(error.statusCode)
                        .json(
                            _.extend({error:'Failed to load npm'}, error)
                        );
        }

        if (req.params.module && req.params.module.length) {
            npm.config.set('save', true);
            npm.commands.uninstall(
                [req.params.module],
                function (error) {
                    if (error) {
                        console.error(
                            '[Installable] npm uninstall returned error: %j'.error, error
                        );

                        return res.status(error.statusCode)
                                    .json(
                                        _.extend({error:'npm uninstall failed'}, error)
                                    );
                    }

                    installable().build(function (error) {
                        if (error) {
                            return res.status(error.statusCode)
                                .json(
                                    _.extend({error:'Failed to build app'}, error)
                                );
                        }

                        res.json({ok: true});
                        installable().restartServer();
                    });
                }
            );
        } else {
            res.status(400).json({error: 'No module name given'});
        }
    });
};


exports.list = function (req, res) {
    var pkg = require(process.cwd() + '/package.json');
    var plugins = matchdep
        .filter(pkg.name + '-plugin-*', pkg)
        .map(function (pluginName) {
            return {
                name: pluginName,
                version: pkg.dependencies[pluginName]
            };
        });

    res.json(plugins);
};


function installable () {
    return require('./../index');
}
