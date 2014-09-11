'use strict';

require('./app.less');

var $ = require('jquery');
var url = require('./app.jpg');
$('<img src="' + url + '">').appendTo('body');


var App = {
    plugins: []
};

module.exports = App;
