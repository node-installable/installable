'use strict';

var todos = require('./../controllers/todos_controller');

// Hapi.Server#route argument
module.exports = [
    { method: 'GET', path: '/todos/{todoId}', handler: todos.show },
    { method: 'GET', path: '/todos', handler: todos.index }
];
