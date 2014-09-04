'use strict';

var routes = require('./routes');

exports.register = function (plugin, options, next) {
    plugin.route(routes);
    next();
};
