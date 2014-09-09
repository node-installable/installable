'use strict';

var routes = require('./config/routes');

exports.register = function (plugin, options, next) {
    plugin.route(routes);
    next();
};

exports.register.attributes = {
    pkg: require('./../package.json')
};
