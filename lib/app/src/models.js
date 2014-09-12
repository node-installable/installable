'use strict';

var Backbone = require('backbone');

var Module = Backbone.Model.extend({
    idAttribute: 'name',
    url: function () {
        return '/installable/api/modules/' + this.id;
    }
});

exports.Module = Module;

var Modules = Backbone.Collection.extend({
    model: Module,
    url: '/installable/api/modules'
});


exports.Modules = Modules;

exports.SearchModules = Modules.extend({
    url: '/installable/api/modules/search'
});
