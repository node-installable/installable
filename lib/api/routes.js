'use strict';
var path = require('path');
var modules = require('./modules');
var server = require('./server');

// Hapi.Server#route argument
module.exports = [
    // default plugins manager routes
    { method: 'GET', path: '/', handler: {
        file: path.resolve(__dirname + './../app/build/index.html') }
    },
    { method: 'GET', path: '/build.js', handler: {
        file: path.resolve(__dirname + './../app/build/build.js') }
    },

    // API routes
    { method: 'GET', path: '/api/modules/search', handler: modules.search },
    { method: 'PUT', path: '/api/modules/{module}', handler: modules.install },
    { method: 'DELETE', path: '/api/modules/{module}', handler: modules.uninstall },
    { method: 'GET', path: '/api/modules', handler: modules.list },
    { method: 'POST', path: '/api/server/restart', handler: server.restart }
];
