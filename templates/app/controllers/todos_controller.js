'use strict';

var todos = [
    {
        id: 1,
        title: 'build something',
        done: false
    },
    {
        id: 2,
        title: 'ship its',
        done: false
    }
];

exports.index = function (request, reply) {
    reply(todos);
};

exports.show = function (request, reply) {
    findTodo(parseInt(request.params.todoId, 10), function (err, todo) {
        if (err) {
            return reply({message: err}).code(404);
        }
        reply(todo);
    });
};


function findTodo (id, cb) {
    var todo;

    todos.forEach(function (t) {
        if (t.id === id) {
            todo = t;
        }
    });

    if (todo) {
        cb(null, todo);
    } else {
        cb('Wrong id!');
    }
}
