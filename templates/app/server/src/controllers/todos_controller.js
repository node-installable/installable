'use strict';

exports.index = function (req, res) {
    res.json(todos);
};

exports.show = function (req, res) {
    findTodo(parseInt(req.params.id, 10), function (err, todo) {
        if (err) {
            return res.status(404).json({message: err});
        }
        res.json(todo);
    });
};

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
