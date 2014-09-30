'use strict';
var expect = require('chai').expect;
var App = require('./../../src/components/app/');

describe('App', function () {
    describe('.plugins', function () {
        it('should have a plugins array', function () {
            expect(App.plugins).to.be.an.instanceof(Array);
        });

        it('should have zero plugins', function () {
            expect(App.plugins.length).to.equal(0);
        });
    });
});
