'use strict';
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var modulesControllerFactory = require('../../lib/api/modules');

describe('ModulesController', function () {
    beforeEach(function () {
        this.installable = {
            build: function () {},
            restartApplication: function () {}
        };

        var bodySpy = this.bodySpy = sinon.spy();
        var response = this.response = {json: bodySpy};
        var statusSpy = this.statusSpy = sinon.spy(function () {
            return response;
        });

        response.status = statusSpy;

        this.subject = modulesControllerFactory(this.installable);
    });

    describe('#initialization', function () {
        it('has an installable', function () {
            expect(this.subject).to.have.property('installable');
        });

        it('has an inpm', function () {
            expect(this.subject).to.have.property('inpm');
        });
    });

    describe('#list', function () {
        beforeEach(function () {
            sinon.stub(this.subject.inpm, 'installedModules', function () {
                return [{name: 'lola'}];
            });
            this.subject.list(null, this.response);
        });

        it('should return an array of installed modules', function () {
            expect(this.bodySpy).to.have.been.calledWith([{name: 'lola'}]);
        });
    });

    describe('#search', function () {
        describe('when no error occurs', function () {
            beforeEach(function () {
                var stub = sinon.stub(this.subject.inpm, 'search');
                stub.withArgs('lola').yields(null, [{name: 'lola'}]);

                this.subject.search({
                    query: {
                        term: 'lola'
                    }
                }, this.response);
            });

            it('should return an array of results', function () {
                expect(this.bodySpy).to.have.been.calledWith([{name: 'lola'}]);
            });
        });

        describe('when an error occurs', function () {
            beforeEach(function () {
                var stub = sinon.stub(this.subject.inpm, 'search');
                stub.withArgs('lola').yields(new Error('so sorry'));

                this.subject.search({
                    query: {
                        term: 'lola'
                    }
                }, this.response);
            });

            it('should return status 500', function () {
                expect(this.statusSpy).to.have.been.calledWith(500);
            });

            it('should return an error message', function () {
                expect(this.bodySpy).to.have.been.calledWith({error: 'so sorry'});
            });
        });
    });

    ['install', 'uninstall'].forEach(function (command) {
        describe('#' + command, function () {
            describe('when no error occurs', function () {
                beforeEach(function () {
                    var stub = sinon.stub(this.subject.inpm, command);
                    stub.withArgs('lola').yields();
                    sinon.stub(this.subject.installable, 'build').yields();
                    this.restartSpy = sinon.spy(this.subject.installable, 'restartApplication');

                    this.subject[command]({
                        params: {
                            module: 'lola'
                        }
                    }, this.response);
                });

                it('should return {ok: true}', function (done) {
                    setTimeout(function () {
                        expect(this.bodySpy).to.have.been.calledWith({ok: true});
                        done();
                    }.bind(this), 10);
                });

                it('should restartApplication', function (done) {
                    setTimeout(function () {
                        expect(this.restartSpy).to.have.callCount(1);
                        done();
                    }.bind(this), 10);
                });
            });

            describe('when an error occurs', function () {
                beforeEach(function () {
                    var stub = sinon.stub(this.subject.inpm, command);
                    stub.withArgs('lola').yields(new Error('another error'));

                    this.subject[command]({
                        params: {
                            module: 'lola'
                        }
                    }, this.response);
                });

                it('should return 500', function (done) {
                    setTimeout(function () {
                        expect(this.statusSpy).to.have.been.calledWith(500);
                        done();
                    }.bind(this), 10);
                });

                it('should return an error message', function (done) {
                    setTimeout(function () {
                        expect(this.bodySpy).to.have.been.calledWith({error: 'another error'});
                        done();
                    }.bind(this), 10);
                });
            });
        });
    });
});
