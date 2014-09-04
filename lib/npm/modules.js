'use strict';

var npm = require('npm');

var appName = require(process.cwd() + '/package.json').name;

console.log('appName %s', appName);

exports.search = function (request, reply) {
    console.log('search term ', request.params.term)
    npm.load(null, function (error) {
        if (error) return reply({error: error});

        if (request.params.term && request.params.term.length) {
            npm.commands.search([request.params.term, appName + '-plugin'], function (error, data) {
                if (error) return reply({error: error});
                reply(data);
            });
        }
    });
};

exports.install = function (request, reply) {
    reply({ok: true});
};

exports.uninstall = function (request, reply) {
    reply({ok: true});
};
