'use strict';

var $ = require('jquery');

$.getJSON('/todos', function (data) {
    $('<ul>').append(data.map(function (todo) {
        return $('<li>').text(todo.title);
    })).appendTo('body');
});

var App = require('./components/app/');

var pluginRegistry = {
    add: function (plugin) {
        App.plugins.push(plugin);
    }
};

// expose only your app's interface to plugins
require('installable-browser-plugins-loader')(pluginRegistry);
console.log(App.plugins.length + ' plugins found', App.plugins);
