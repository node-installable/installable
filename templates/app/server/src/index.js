var path = require('path');
var installable = require('installable');
var app = require('./app');

// set pluninsPath, defaults to '/plugins'
// thus a plugin named 'test' will expose its routes
// under '/plugins/test/*'
// app.set('pluginsPath', 'myPluginsPath');
installable.startServer(app, path.resolve(__dirname + './../../package.json'));
