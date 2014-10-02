'use strict';
var fs = require('fs');
var path = require('path');
var npm = require('npm');
var checkNpm = require('./util').checkNpm;
var ejs = require('ejs');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var log = console.log;

function createPlugin (pluginName, appName, options) {
    log();

    var pluginNpmName = appName + '-plugin-' + pluginName;

    if (options.skipNpm) {
        createPluginDirectory(appName, pluginNpmName, options);
    } else {
        checkNpm(pluginNpmName, function (err) {
            if (err) {
                return log(err);
            }

            createPluginDirectory(appName, pluginNpmName);
        });
    }
}

function createPluginDirectory (appName, pluginNpmName) {
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

                npm.load(null, function () {
                    npm.view(appName, function (error, data) {
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
                });
            }
        );
    });
}

module.exports = createPlugin;
