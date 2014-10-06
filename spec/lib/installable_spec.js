'use strict';
var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);

var express = require('express');
var request = require('request');

var Installable = require('../../lib/installable');

describe('Installable', function () {
    before(function () {
        this.builder = sinon.spy();
        this.packagePath = path.join(__dirname, '../fixtures/my-app/package.json');
        this.app = express();
        this.app.set('port', 9000);

        /* jshint unused:false */
        this.app.set('errorHandler', function (err, req, res, next) {
            res.status(err.status || 500);
            res.json({
                message: err.message,
                error: err
            });
        });

        this.subject = new Installable(this.app, this.packagePath, this.builder);
    });

    describe('#initialization', function () {
        it('should be an Installable instance', function () {
            expect(this.subject).to.be.instanceOf(Installable);
        });

        it('should have a pkgPath property', function () {
            expect(this.subject.pkgPath).to.equal(this.packagePath);
        });

        it('should have a projectRoot property', function () {
            expect(this.subject.projectRoot).to.equal(path.join(__dirname, '../fixtures/my-app/'));
        });

        it('should have an appName property', function () {
            expect(this.subject.appName).to.equal('my-app');
        });

        it('should have an pluginsRegExp property', function () {
            expect(this.subject.pluginsRegExp.toString()).to.equal(/my-app-plugin-.+/.toString());
        });

        it('should have an empty sockets array', function () {
            expect(this.subject.sockets).to.be.instanceOf(Array);
            expect(this.subject.sockets.length).to.be.equal(0);
        });
    });

    describe('#build', function () {
        it('should call the front end builder', function () {
            this.subject.build();
            expect(this.builder).to.have.been.calledWith({fake: 'webpack'});
        });
    });

    describe('#startServer', function () {
        beforeEach(function (done) {
            this.subject.startServer(done);
        });

        afterEach(function (done) {
            this.subject.stopServer(done);
        });

        it('starts a http server', function (done) {
            request('http://localhost:' + this.app.get('port') + '/installable', done);
        });

        it('mounts installable routes', function (done) {
            request('http://localhost:' + this.app.get('port') + '/installable/api/modules', done);
        });

        it('mounts error handler', function (done) {
            request(
                'http://localhost:' + this.app.get('port') + '/somethingrandom',
                function (err, res) {
                    expect(res.statusCode).to.equal(404);
                    done(err);
                }
            );
        });
    });

    describe('#stopServer', function () {
        beforeEach(function (done) {
            this.subject.startServer(done);
        });

        it('stops the http server', function (done) {
            this.subject.stopServer(function () {
                request(
                    'http://localhost:' + this.app.get('port') + '/installable',
                    function (err) {
                        expect(err).to.be.a('object');
                        done();
                    }
                );
            }.bind(this));
        });
    });

    describe('#restartApplication', function () {
        beforeEach(function (done) {
            this.subject.startServer(done);
        });

        it('sends a restart command to cluster\'s master', function (done) {
            var spy = sinon.spy();
            process.send = spy;
            this.subject.restartApplication();

            setTimeout(function () {
                expect(spy).to.have.been.calledWith({command: 'restart'});
                done();
            }, 40);
        });
    });
});
