'use strict';

var modules = require('./modules');
var server = require('./server');

// Hapi.Server#route argument
module.exports = [
    { method: 'GET', path: '/modules/search/{term?}', handler: modules.search },
    { method: 'POST', path: '/modules/{module}', handler: modules.install },
    { method: 'DELETE', path: '/modules/{module}', handler: modules.uninstall },
    { method: 'POST', path: '/server/restart', handler: server.restart }
];
