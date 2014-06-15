var npm = require('npm');

function Moog () {}

(function () {
  this.start = function () {

  };

  this.install = function () {
    return npm.install();
  };


}).call(Moog.prototype);

module.exports = Moog;