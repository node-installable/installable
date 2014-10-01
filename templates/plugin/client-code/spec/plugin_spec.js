'use strict';
var expect = require('chai').expect;
var plugin = require('./../src/plugin');

describe('plugin', function () {
    it('should have a hello property', function () {
        expect(plugin.hello).to.equal('hello from the plugin');
    });
});
