'use strict';
var npm = require('npm');

function Moog () {}

(function () {
    this.start = function () {
        console.log('start');
    };

    this.install = function () {
        return npm.install();
    };


}).call(Moog.prototype);

module.exports = Moog;
