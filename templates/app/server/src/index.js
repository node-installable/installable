var path = require('path');
var installable = require('installable');
var app = require('./app');

installable.startServer(app, path.resolve('package.json'));
