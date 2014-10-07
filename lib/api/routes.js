'use strict';
var express = require('express');
var path = require('path');

module.exports = function (installable) {
    var router = express.Router();
    var managerPath = path.join(
        __dirname, '..', '..', 'node_modules', 'installable-web-manager', 'dist'
    );

    router.use(express.static(managerPath));

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
