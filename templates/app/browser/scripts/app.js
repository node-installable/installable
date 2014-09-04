'use strict';

var App = {
        plugins: []
    },
    pluginRegistry = {
        add: function (plugin) {
            App.plugins.push(plugin);
        }
    };

// expose only your app's interface to plugins
require('installable-browser-plugins-loader')(pluginRegistry);
console.log('appa mys ass')
module.exports = App;
