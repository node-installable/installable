'use strict';
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var rewire = require('rewire');

var installable = rewire('../../lib/');

describe('installable.startServer', function () {
    describe('when it is master', function () {
        beforeEach(function () {
            // jscs:disable
            installable.__set__('cluster', {isMaster: true});
            // jscs:enable
        });

        it('calls fork() on a ClusterManager', function () {
            var spy = sinon.spy();
            // jscs:disable
            installable.__set__('ClusterManager', function () {
                this.fork = spy;
            });
            // jscs:enable

            installable.startServer();
            expect(spy.called).to.equal(true);
        });
    });

    describe('when it is not master', function () {
        beforeEach(function () {
            // jscs:disable
            installable.__set__('cluster', {isMaster: false});
            // jscs:enable
            var startServerSpy = this.startServerSpy = sinon.spy();
            this.installableClassSpy = sinon.spy(function () {
                this.startServer = startServerSpy;
            });
            // jscs:disable
            installable.__set__('Installable', this.installableClassSpy);
            // jscs:enable
        });

        it('instantiates an Installable', function () {
            installable.startServer({}, 'path', 'callback');
            expect(this.installableClassSpy).to.have.been.calledWith({}, 'path');
        });

        it('calls startServer() on an Installable', function () {
            installable.startServer({}, 'path', 'callback');
            expect(this.startServerSpy).to.have.been.calledWith('callback');
        });
    });
});
