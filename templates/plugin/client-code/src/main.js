'use strict';

var plugin = require('./plugin');

module.exports = function (pluginRegistry) {
    console.log('pluginRegistry', pluginRegistry);
    // register your plugin according to your api
    pluginRegistry.add(plugin);
};
