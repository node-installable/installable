'use strict';
require('./utils/colors');
var cluster = require('cluster');
var webpack = require('webpack');
var Installable = require('./installable');
var ClusterManager = require('./cluster_manager');

module.exports = {
    startServer: function (app, pkgPath, cb) {
        var isDebug = process.execArgv.indexOf('--debug') !== -1;

        if (cluster.isMaster && !isDebug) {
            new ClusterManager().fork();
        } else {
            new Installable(app, pkgPath, webpack).startServer(cb);
        }
    }
};
