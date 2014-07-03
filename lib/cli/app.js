'use strict';

var fs = require('fs');
var path = require('path');
var npm = require('npm');
var ejs = require('ejs');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');

var log = console.log;

function createApp (appName) {
    log();

    npm.load(null, function () {
        log(
            'Checking npm registry for module '.info + appName.highlight
        );

        npm.view(appName, function (error) {
            if (error) {
                if (error.code === 'E404') {
                    log(
                        ('npm module ' + appName + ' is').info +
                        ' available'.success
                    );
                } else {
                    log(
                        'Failed to check module existance. Error code: ' +
                        error.code
                    );
                }

                var directory = path.normalize(process.cwd() + '/' + appName);

                mkdirp(directory, function (err) {
                    if (err) {
                        return console.error(err);
                    }

                    ncp(
                        path.join(__dirname, '/../../templates/app'),
                        directory,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }

                            var packageTemplatePath =
                                directory + '/' + 'package.ejs';

                            fs.writeFileSync(
                                directory + '/' + 'package.json',
                                ejs.render(
                                    fs.readFileSync(
                                        packageTemplatePath, 'utf8'
                                    ),
                                    {appName: appName}
                                )
                            );

                            fs.unlinkSync(packageTemplatePath);

                            log('Your application structure is ready'.info);
                        }
                    );
                });
            } else {
                console.error(
                    'npm module %s already exists'.error,
                    appName
                );
            }
        });
    });
}

module.exports = createApp;
