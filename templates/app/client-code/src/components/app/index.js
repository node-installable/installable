'use strict';

require('./index.less');

var $ = require('jquery');
var url = require('./lola.jpg');
$('<img src="' + url + '">').appendTo('body');


var App = {
    plugins: []
};

module.exports = App;
