'use strict';
var npm = require('npm');
var async = require('async');

/**
 * A thin wrapper of npm
 * @constructor
 */
function InstallableNpm () {
}


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
        function (data, done) {
            done('npm module ' + moduleName + ' already exists');
        }
    ], function (err) {
        if (typeof err === 'string') {
            cb(err);
        } else if (err.code === 'E404') {
            cb();
        } else {
            cb('Failed to check module existance. Error code: ' + err.code);
        }
    });
};

module.exports = InstallableNpm;
