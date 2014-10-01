'use strict';
var npm = require('npm');
var NpmScrapper = require('npm-scrap');
var matchdep = require('matchdep');
var _ = require('lodash');

var appName = require(process.cwd() + '/package.json').name;
var pluginsRegExp = new RegExp(appName + '-plugin-.+');

exports.search = function (req, res) {
    var terms = appName + '-plugin ';

    if (req.query.term) {
        terms += req.query.term;
    }

    console.log('[Installable] Search started. Terms: %j '.info, terms);

    new NpmScrapper(terms).search(function (error, data) {
        if (error) {
            console.log('[Installable] Search returned error: %j'.error, error);
            return res.status(error.statusCode)
                        .json(
                            _.extend({error:'npm search failed'}, error)
                        );
        }

        // filter results with pluginsRegExp cause
        // npmjs.org search ALWAYS returns results
        data = data.filter(function (moduleData) {
            return moduleData.name.match(pluginsRegExp);
        });

        console.log('[Installable] Search returned success: %s results'.info,
            data.length);

        res.json(data);
    });
};

exports.install = function (req, res) {
    npmCommand('install', req, res);
};

exports.uninstall = function (req, res) {
    npmCommand('uninstall', req, res);
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

// FIXME TODO
function installable () {
    return require('./../index');
}

function validateModuleName (moduleName, cb) {
    if (!moduleName || moduleName.length === 0) {
        return cb('No module name given');
    }

    if (!moduleName.match(pluginsRegExp)) {
        return cb('Requested module is not a plugin of ' + appName);
    }

    cb();
}

function npmCommand (command, req, res) {
    validateModuleName(req.params.module, function (errorMessage) {
        if (errorMessage) {
            return res.status(400)
                .json({error: errorMessage});
        }

        npm.load(null, function (error) {
            if (error) {
                return res.status(error.statusCode)
                            .json(
                                _.extend({error:'Failed to load npm'}, error)
                            );
            }

            npm.config.set('save', true);
            npm.commands[command](
                [req.params.module],
                function (error) {
                    if (error) {
                        console.error(
                            '[Installable] npm ' + command + ' returned error: %j'.error, error
                        );

                        return res.status(error.statusCode)
                                    .json(
                                        _.extend({error:'npm ' + command + ' failed'}, error)
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
        });
    });
}
