'use strict';
var path = require('path');
var fs = require('fs');
var child = require('child_process');
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var async = require('async');
var request = require('request');
var expect = require('chai').expect;

// this takes about 2 minutes so run it only on CI
var func = process.env.CLI_TEST ? describe : describe.skip;

func('App and plugin templates integration', function () {
    this.timeout(200000);
    before(function (done) {
        this.tempPath = path.join(__dirname, './../../tmp');
        rimraf(this.tempPath, function () {
            mkdirp(this.tempPath, done);
        }.bind(this));
    });

    after(function (done) {
        rimraf(this.tempPath, done);
    });

    it('should create, install run without errors', function (done) {
        var tempPath = this.tempPath;
        var executablePath = path.join(__dirname, '../../bin/installable');

        var appCreationCommand = 'cd ' + this.tempPath +
            ' && ' + executablePath + ' app lola -s';

        var pluginCreationCommand = 'cd ' + this.tempPath +
            ' && ' + executablePath + ' plugin pola lola -s';

        var pluginLinkCommand = 'cd ' + this.tempPath +
            '/lola-plugin-pola && npm link &&' +
            'cd '  + this.tempPath + '/lola && npm link lola-plugin-pola';

        var npmInstallCommand = 'cd ' + this.tempPath + '/lola && npm install';
        var runCommand = 'cd ' + this.tempPath + '/lola && npm start';

        async.waterfall([
            function (cb) {
                child.exec(appCreationCommand, cb);
            },
            function (stdout, stderr, cb) {
                child.exec(pluginCreationCommand, cb);
            },
            function (stdout, stderr, cb) {
                child.exec(pluginLinkCommand, cb);
            },
            function (stdout, stderr, cb) {
                var pkgPath = tempPath + '/lola/package.json';
                var pkg = require(pkgPath);
                pkg.dependencies['lola-plugin-pola'] = '';
                fs.writeFile(pkgPath, JSON.stringify(pkg), cb);
            },
            function (cb) {
                child.exec(npmInstallCommand, cb);
            },
            function (stdout, stderr, cb) {
                child.exec(runCommand);
                setTimeout(cb, 3500);
            },
            function (cb) {
                request('http://localhost:3000/plugins/pola/sample', cb);
            }
        ], function (err, res, body) {
            expect(body).to.equal(JSON.stringify({hello: 'sample response'}));
            done(err);
        });
    });
});
