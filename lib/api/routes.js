'use strict';
var path = require('path');
var modules = require('./modules');
var server = require('./server');

// Hapi.Server#route argument
module.exports = [
    // default plugins manager routes
    { path: '/', method: 'GET', handler: {
        file: path.resolve(__dirname + './../app/build/index.html') }
    },
    { path: '/build.js', method: 'GET', handler: {
        file: path.resolve(__dirname + './../app/build/build.js') }
    },

    // API routes
    { path: '/api/modules/search', method: 'GET', handler: modules.search },
    { path: '/api/modules/{module}', method: 'PUT', handler: modules.install },
    { path: '/api/modules/{module}', method: 'DELETE', handler: modules.uninstall },
    { path: '/api/modules', method: 'GET', handler: modules.list },
    { path: '/api/server/restart', method: 'POST', handler: server.restart }
];
