'use strict';

module.exports = function (pluginRegistry) {
    console.log('pluginRegistry', pluginRegistry);
    // register your plugin according to your api
    pluginRegistry.add({hello: 'plugin'});
    require('./style.less');
};
