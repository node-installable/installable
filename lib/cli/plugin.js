'use strict';
var fs = require('fs');
var path = require('path');
var InstallableNpm = require('./../services/installable_npm');
var ejs = require('ejs');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var log = console.log;

function createPlugin (pluginName, appName, options) {
    log();

    var pluginNpmName = appName + '-plugin-' + pluginName;
    var inpm = new InstallableNpm();

    if (options.skipNpm) {
        createPluginDirectory(appName, pluginNpmName, inpm);
    } else {
        log('Checking npm for availability of %s'.info, pluginNpmName);
        inpm.available(pluginNpmName, function (err) {
            if (err) {
                return log(err.message.error);
            }

            createPluginDirectory(appName, pluginNpmName, inpm);
        });
    }
}

function createPluginDirectory (appName, pluginNpmName, inpm) {
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

                inpm.view(appName, function (error, data) {
                    var appVersion;

                    if (error) {
                        appVersion = '^0.0.1';
                    } else {
                        appVersion = '^' + data[Object.keys(data)[0]].version;
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

                    ncp(path.join(
                        __dirname, '/../../templates/dotfiles'),
                        directory,
                        function (err) {
                            if (err) {
                                return console.error(err);
                            }

                            if (fs.existsSync(directory + '/.npmignore')) {
                                fs.renameSync(
                                    directory + '/.npmignore',
                                    directory + '/.gitignore'
                                );
                            }
                        }
                    );

                    log('Your application structure is ready'.info);
                });
            }
        );
    });
}

module.exports = createPlugin;
