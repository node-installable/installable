'use strict';
var express = require('express');
var router = express.Router();

var modules = require('./modules');
var server = require('./server');

router.use(express.static(__dirname + './../app/dist'));

// modules
router.get('/api/modules/search', modules.search);
router.put('/api/modules/:module', modules.install);
router.delete('/api/modules/:module', modules.uninstall);
router.get('/api/modules', modules.list);

// server
router.post('/api/server/restart', server.restart);

module.exports = router;
