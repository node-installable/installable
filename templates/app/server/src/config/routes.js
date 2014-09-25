'use strict';
var sample = require('./../controllers/sample_controller');

module.exports = function (router) {
    router.get('/sample', sample.index);
};
