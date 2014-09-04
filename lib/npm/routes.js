'use strict';

var modules = require('./modules');

// Hapi.Server#route argument
module.exports = [
    { method: 'GET', path: '/modules/search/{term?}', handler: modules.search },
    { method: 'POST', path: '/modules/{module}', handler: modules.install },
    { method: 'DELETE', path: '/modules/{module}', handler: modules.uninstall }
];
