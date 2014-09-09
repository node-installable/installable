'use strict';

require('style!css!less!./app.less');

var $ = require('jquery');
var url = require('file!./app.jpg');
$('<img src="' + url + '">').appendTo('body');


var App = {
    plugins: []
};

module.exports = App;
