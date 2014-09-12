'use strict';

var Installable = require('./../index');

exports.restart = function (response, reply) {
    reply({ok: true});
    Installable.restartServer();
};
