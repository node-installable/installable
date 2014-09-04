'use strict';

var $ = require('jquery');

$.getJSON('/todos', function (data) {
    console.log('data', data);
    $('<ul>').append(data.map(function (todo) {
        return $('<li>').text(todo.title + '22');
    })).appendTo('body');
});

var App = require('./app');
console.log(App.plugins.length + ' plugins found', App.plugins);
