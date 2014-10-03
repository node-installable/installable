'use strict';
var express = require('express');

module.exports = function (installable) {
    var router = express.Router();
    router.use(express.static(__dirname + './../app/dist'));

    // modules
    var modules = require('./modules')(installable);
    router.get('/api/modules/search', modules.search.bind(modules));
    router.put('/api/modules/:module', modules.install.bind(modules));
    router.delete('/api/modules/:module', modules.uninstall.bind(modules));
    router.get('/api/modules', modules.list.bind(modules));

    // server
    var server = require('./server')(installable);
    router.post('/api/server/restart', server.restart.bind(server));

    return router;
};
