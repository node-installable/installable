'use strict';
var async = require('async');
var debug = require('debug')('installable');
var InstallableNpm = require('./../services/installable_npm');

module.exports = function (installable) {
    return new ModulesController(installable);
};

function ModulesController (installable) {
    this.installable = installable;
    this.inpm = new InstallableNpm(installable);
}

ModulesController.prototype.list = function (req, res) {
    res.json(this.inpm.installedModules());
};

ModulesController.prototype.search = function (req, res) {
    debug('Search started. Term: %s'.info, req.query.term);
    this.inpm.search(req.query.term, function (err, data) {
        if (err) {
            debug('Search returned error: %j'.error, err);
            return res.status(500)
                .json({
                    error: err.message || 'npm search failed'
                });
        }

        res.json(data);
    });
};

ModulesController.prototype.install = function (req, res) {
    this.command('install', req, res);
};

ModulesController.prototype.uninstall = function (req, res) {
    this.command('uninstall', req, res);
};

ModulesController.prototype.command = function (command, req, res) {
    var self = this;

    async.waterfall([
        function (done) {
            self.inpm[command](req.params.module, done);
        },
        function (done) {
            self.installable.build(done);
        }
    ], function (err) {
        if (err) {
            debug(command + ' returned error: %j'.error, err);
            res.status(err.status || 500)
                .json({
                    error: err.message || 'npm ' + command + ' failed'
                });
        } else {
            debug('Build was successful. Restarting...'.info);
            res.json({ok: true});
            self.installable.restartApplication();
        }
    });
};
