'use strict';
var path = require('path');
var installable = require('installable');
var app = require('./app');

// set pluninsPath, defaults to '/plugins'
// thus a plugin named 'test' will expose its routes
// under '/plugins/test/*'
// app.set('pluginsPath', 'myPluginsPath');

app.set('port', process.env.PORT || 3000);

installable.startServer(
    app,
    path.resolve(__dirname + './../../package.json'),
    function (err, server) {
        console.log('Server listening on port: %s', server.address().port);
    }
);
