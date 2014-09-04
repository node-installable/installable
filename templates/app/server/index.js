'use strict';
var server = require('./config/server'),
    routes = require('./config/routes'),
    pkg = require('./../package.json'),
    installable = require('installable');

installable.startServer({
    server: server,
    routes: routes
}, pkg);
