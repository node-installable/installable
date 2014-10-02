'use strict';
var express = require('express');

module.exports = function (installable) {
    var router = express.Router();

    var modules = require('./modules')(installable);
    var server = require('./server')(installable);

    router.use(express.static(__dirname + './../app/dist'));

    // modules
    router.get('/api/modules/search', modules.search.bind(modules));
    router.put('/api/modules/:module', modules.install.bind(modules));
    router.delete('/api/modules/:module', modules.uninstall.bind(modules));
    router.get('/api/modules', modules.list.bind(modules));

    // server
    router.post('/api/server/restart', server.restart.bind(server));

    return router;
};
