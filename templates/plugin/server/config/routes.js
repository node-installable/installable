'use strict';

var sample = require('./../controllers/sample_controller');

// Hapi.Server#route argument
module.exports = [
    { method: 'GET', path: '/sample', handler: sample.index }
];
