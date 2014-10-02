'use strict';
var npm = require('npm');
var log = console.log;

exports.checkNpm = function (moduleName, cb) {
    npm.load(null, function () {
        log('Checking npm registry for module '.info + moduleName.highlight);

        npm.view(moduleName, function (err) {
            if (err) {
                if (err.code === 'E404') {
                    log(('npm module ' + moduleName + ' is').info + ' available'.success);
                    cb();
                } else {
                    cb('Failed to check module existance. Error code: ' + err.code);
                }
            } else {
                cb('npm module %s already exists'.error, moduleName);
            }
        });
    });
};
