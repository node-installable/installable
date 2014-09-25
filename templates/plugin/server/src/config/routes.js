'use strict';
var router = require('express').Router;

var sample = require('./../controllers/sample_controller');
router.get('/sample', sample.index);

module.exports = router;
