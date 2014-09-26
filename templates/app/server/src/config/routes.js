'use strict';
var router = require('express').Router();
var todos = require('./../controllers/todos_controller');

router.get('/todos', todos.index);
router.get('/todos/:id', todos.show);

module.exports = router;
