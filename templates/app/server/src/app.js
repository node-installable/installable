'use strict';
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./config/routes');

var app = express();

app.set('errorHandler', errorHandler);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './../../client/dist')));

app.use('/', routes);

/* jshint unused:false */
function errorHandler (err, req, res, next) {
    // production error handler
    // no stacktraces leaked to user
    if (app.get('env') === 'production') {
        err = {};
    }
    res.status(err.status || 500);
    res.json({
        message: err.message,
        error: err
    });
}

module.exports = app;
