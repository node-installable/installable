'use strict';
var npm = require('npm');
var NpmScrapper = require('npm-scrap');
var matchdep = require('matchdep');
var _ = require('lodash');
var debug = require('debug')('installable');

module.exports = function (installable) {
    return new ModulesController(installable);
};

function ModulesController (installable) {
    this.installable = installable;
}

ModulesController.prototype.search = function (req, res) {
    var terms = this.installable.appName + '-plugin';

    if (req.query.term) {
        terms = req.query.term + ' ' + terms;
    }

    debug('Search started. Terms: %j '.info, terms);

    new NpmScrapper(terms).search(function (error, data) {
        if (error) {
            debug('Search returned error: %j'.error, error);
            return res.status(error.statusCode)
                        .json(
                            _.extend({error:'npm search failed'}, error)
                        );
        }

        // filter results with pluginsRegExp cause
        // npmjs.org search ALWAYS returns results
        data = data.filter(function (moduleData) {
            return moduleData.name.match(this.installable.pluginsRegExp);
        }.bind(this));

        debug('Search returned success: %s results'.info, data.length);

        res.json(data);
    });
};

ModulesController.prototype.install = function (req, res) {
    npmCommand(this.installable, 'install', req, res);
};

ModulesController.prototype.uninstall = function (req, res) {
    npmCommand(this.installable, 'uninstall', req, res);
};

ModulesController.prototype.list = function (req, res) {
    delete require.cache[this.installable.pkgPath];
    var pkg = require(this.installable.pkgPath);
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

function validateModuleName (moduleName, pluginsRegExp, cb) {
    if (!moduleName || moduleName.length === 0) {
        return cb('No plugin name given.');
    }

    if (!moduleName.match(pluginsRegExp)) {
        return cb('Requested module is not a plugin of this application.');
    }

    cb();
}

function npmCommand (installable, command, req, res) {
    debug('npmCommand: %s', command);

    validateModuleName(req.params.module, installable.pluginsRegExp, function (errorMessage) {
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
                        debug('npm ' + command + ' returned error: %j'.error, error);

                        return res.status(error.statusCode)
                                    .json(
                                        _.extend({error:'npm ' + command + ' failed'}, error)
                                    );
                    }

                    installable.build(function (error) {
                        if (error) {
                            return res.status(error.statusCode)
                                .json(
                                    _.extend({error:'Failed to build app'}, error)
                                );
                        }

                        res.json({ok: true});

                        installable.restartServer();
                    });
                }
            );
        });
    });
}
