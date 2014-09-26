'use strict';

var fs = require('fs'),
    path = require('path'),
    npm = require('npm'),
    ejs = require('ejs'),
    ncp = require('ncp').ncp,
    mkdirp = require('mkdirp'),
    log = console.log;

function createPlugin (pluginName, appName) {
    log();

    var pluginNpmName = appName + '-plugin-' + pluginName;

    npm.load(null, function () {
        log(
            'Checking npm registry for module '.info + pluginNpmName.highlight
        );

        npm.view(pluginNpmName, function (error) {
            if (error) {
                if (error.code === 'E404') {
                    log(
                        ('npm module ' + pluginNpmName + ' is').info +
                        ' available'.success
                    );
                } else {
                    log(
                        'Failed to check module existance. Error code: ' +
                        error.code
                    );
                }

                var directory = path.normalize(
                    process.cwd() + '/' + pluginNpmName
                );

                mkdirp(directory, function (err) {
                    if (err) {
                        return console.error(err);
                    }

                    ncp(
                        path.join(__dirname, '/../../templates/plugin'),
                        directory,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }

                            // hack for webpack regexp based require
                            // See installable-browser-plugins-loader code
                            fs.renameSync(
                                directory + '/client-code',
                                directory + '/client'
                            );

                            var packageTemplatePath =
                                directory + '/' + 'package.ejs';

                            npm.view(appName, function (error, data) {
                                var appVersion;

                                if (error) {
                                    appVersion = '^0.0.1';
                                } else {
                                    appVersion = '^' + data.version;
                                }

                                fs.writeFileSync(
                                    directory + '/' + 'package.json',
                                    ejs.render(
                                        fs.readFileSync(
                                            packageTemplatePath, 'utf8'
                                        ),
                                        {
                                            pluginName: pluginNpmName,
                                            keyword: appName + '-plugin',
                                            appName: appName,
                                            appVersion: appVersion
                                        }
                                    )
                                );

                                fs.unlinkSync(packageTemplatePath);

                                log('Your application structure is ready'.info);
                            });
                        }
                    );
                });
            } else {
                console.error(
                    'npm module %s already exists'.error,
                    pluginNpmName
                );
            }
        });
    });
}

module.exports = createPlugin;
