'use strict';
var npm = require('npm');

exports.checkNpm = function (moduleName, callback) {
    npm.load(null, function () {
        console.log(
            'Checking npm registry for module '.info + moduleName.highlight
        );

        npm.view(moduleName, function (error) {
            if (error) {
                if (error.code === 'E404') {
                    console.log(
                        ('npm module ' + moduleName + ' is').info +
                        ' available'.success
                    );
                    callback();
                } else {
                    callback(
                        'Failed to check module existance. Error code: ' +
                        error.code
                    );
                }
            } else {
                callback(
                    'npm module %s already exists'.error,
                    moduleName
                );
            }
        });
    });
};
