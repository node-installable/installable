'use strict';
var npm = require('npm');
var matchdep = require('matchdep');
var NpmScrapper = require('npm-scrap');
var async = require('async');

/**
 * A thin wrapper of npm
 * @param {Object|undefined} installable - optional
 * @constructor
 */
function InstallableNpm (installable) {
    this.installable = installable;
}

/**
 * List installed (installable) modules
 * @return {Array} An array of installed modules (plugins)
 * @public
 */
InstallableNpm.prototype.installedModules = function () {
    var pkg = require(this.installable.pkgPath);
    var plugins = matchdep
        .filter(pkg.name + '-plugin-*', pkg)
        .map(function (pluginName) {
            return {
                name: pluginName,
                version: pkg.dependencies[pluginName]
            };
        });

    return plugins;
};

/**
 * Searches npmjs.org for installable packages
 * @param  {String} term - search term
 * @param  {Function} cb - callback
 * @public
 */
InstallableNpm.prototype.search = function (term, cb) {
    var terms = term;

    if (this.installable) {
        terms = this.installable.appName + '-plugin' + ' ' + terms;
    }

    new NpmScrapper(terms).search(function (err, data) {
        if (err) {
            return cb(err);
        }

        if (this.installable) {
            // filter results with pluginsRegExp cause
            // npmjs.org search ALWAYS returns results
            data = data.filter(function (moduleData) {
                return moduleData.name.match(this.installable.pluginsRegExp);
            }.bind(this));
        }

        cb(null, data);
    }.bind(this));
};

/**
 * Fetch module info from npm
 * @param  {String}   moduleName
 * @param  {Function} cb - callback
 * @public
 */
InstallableNpm.prototype.view = function (moduleName, cb) {
    async.waterfall([
        function (done) {
            npm.load(null, done);
        },
        function (data, done) {
            npm.view(moduleName, done);
        },
        function (data, a, b, done) {
            done(null, data);
        }
    ], function (err, result) {
        cb(err, result);
    });
};

/**
 * Checks availability of a module name in npm
 * @param  {String}   moduleName
 * @param  {Function} cb - callback
 * @public
 */
InstallableNpm.prototype.available = function (moduleName, cb) {
    async.waterfall([
        function (done) {
            npm.load(null, done);
        },
        function (data, done) {
            npm.view(moduleName, done);
        },
        function (module, a, b, done) {
            done(new Error('npm module ' + moduleName + ' already exists'));
        }
    ], function (err) {
        if (err.code === 'E404') {
            cb();
        } else {
            cb(err);
        }
    });
};

/**
 * npm install
 * @param  {String}   moduleName
 * @param  {Function} cb - callback
 * @public
 */
InstallableNpm.prototype.install = function (moduleName, cb) {
    this.command('install', moduleName, cb);
};

/**
 * npm uninstall
 * @param  {String}   moduleName
 * @param  {Function} cb - callback
 * @public
 */
InstallableNpm.prototype.uninstall = function (moduleName, cb) {
    this.command('uninstall', moduleName, cb);
};

/**
 * Validates a plugin name
 * @param  {String} moduleName
 * @return {String|undefined} String if validation error exists, otherwise undefined
 */
InstallableNpm.prototype.validatePluginName = function (moduleName) {
    if (!moduleName || moduleName.length === 0) {
        return 'No plugin name given.';
    }

    if (this.installable && !moduleName.match(this.installable.pluginsRegExp)) {
        return 'Requested module is not a plugin of this application.';
    }

    return undefined;
};

/**
 * Execute npm install or uninstall
 * @param  {String}   command - install or uninstall
 * @param  {String}   moduleName - the name of the module
 * @param  {Function} cb - callback
 * @private
 */
InstallableNpm.prototype.command = function (command, moduleName, cb) {
    var error = this.validatePluginName(moduleName);

    if (error) {
        var err = new Error(error);
        err.status = 400;
        return cb(err);
    }

    async.waterfall([
        function (done) {
            npm.load(null, done);
        },
        function (data, done) {
            npm.config.set('save', true);
            npm.commands[command]([moduleName], done);
        }
    ], function (err) {
        if (err && err.statusCode) {
            err.status = err.statusCode;
        }
        cb(err);
    });
};

module.exports = InstallableNpm;
