'use strict';
var os = require('os');
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
chai.use(sinonChai);
var rewire = require('rewire');

var ClusterManager = rewire('../../lib/cluster_manager');

describe('ClusterManager', function () {
    beforeEach(function () {
        var onMessageSpy = this.onMessageSpy = sinon.spy();
        var killSpy = this.killSpy = sinon.spy();
        var forkSpy = this.forkSpy = sinon.spy(function () {
            return {
                on: onMessageSpy,
                kill: killSpy
            };
        });
        // jscs:disable
        ClusterManager.__set__('cluster', {
            fork: forkSpy
        });
        // jscs:enable
        this.subject = new ClusterManager();
    });

    describe('#initialization', function () {
        it('should have an empty array of workers', function () {
            expect(this.subject.workers).to.be.instanceOf(Array);
            expect(this.subject.workers.length).to.equal(0);
        });

        describe('workersCount', function () {
            it('should equal the number of cores by default', function () {
                expect(this.subject.workersCount).to.equal(os.cpus().length);
            });

            it('should accept it as constructor arg', function () {
                expect(new ClusterManager(111).workersCount).to.equal(111);
            });
        });
    });

    describe('#fork', function () {
        beforeEach(function () {
            this.subject.fork();
        });

        it('should call cluster.fork workersCount times', function () {
            expect(this.forkSpy).to.have.callCount(this.subject.workersCount);
        });

        it('should add an on message listener', function () {
            expect(this.onMessageSpy).to.have.callCount(this.subject.workersCount);
        });

        it('should add the workers to its workers array', function () {
            expect(this.subject.workers.length).to.equal(this.subject.workersCount);
        });
    });

    describe('#onMessage', function () {
        it('calls restart if the message is a restart command', function () {
            var restartSpy = sinon.spy(this.subject, 'restart');
            this.subject.onMessage({command: 'restart'});
            expect(restartSpy).to.have.callCount(1);
        });
    });

    describe('#removeWorker', function () {
        beforeEach(function () {
            this.worker = {};
            this.subject.workers.push(this.worker);
        });

        it('removes a worker from its list', function () {
            this.subject.removeWorker(this.worker);
            expect(this.subject.workers.length).to.equal(0);
        });
    });

    describe('#restart', function () {
        it('calls kill and fork', function () {
            var killSpy = sinon.spy(this.subject, 'kill');
            var restartSpy = sinon.spy(this.subject, 'fork');
            this.subject.restart();
            expect(killSpy).to.have.callCount(1);
            expect(restartSpy).to.have.callCount(1);
        });
    });

    describe('#kill', function () {
        beforeEach(function () {
            this.subject.fork();
        });

        it('should kill and remove all workers', function () {
            this.subject.kill();
            expect(this.killSpy).to.have.callCount(this.subject.workersCount);
            expect(this.subject.workers.length).to.equal(0);
        });
    });
});
