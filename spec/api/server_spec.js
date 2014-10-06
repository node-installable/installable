'use strict';
var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');

var serverControllerFactory = require('../../lib/api/server');

describe('ServerController', function () {
    beforeEach(function () {
        this.installable = {restartApplication: function () {}};
        this.response = {json: function () {}};
        this.restartSpy = sinon.spy(this.installable, 'restartApplication');
        this.responseSpy = sinon.spy(this.response, 'json');
        this.serverController = serverControllerFactory(this.installable);
    });

    describe('#restart', function () {
        beforeEach(function () {
            this.serverController.restart(null, this.response);
        });

        it('calls restartApplication on installable', function () {
            expect(this.restartSpy.calledOnce).to.equal(true);
        });

        it('returns {ok: true}', function () {
            expect(this.responseSpy).to.have.been.calledWith({ok: true});
        });
    });
});
