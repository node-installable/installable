'use strict';
var server = require('./config/server'),
    routes = require('./config/routes'),
    path = require('path'),
    installable = require('installable');

installable.startServer({
    server: server,
    routes: routes
}, path.resolve('package.json'));
