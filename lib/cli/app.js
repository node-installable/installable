'use strict';
var fs = require('fs');
var path = require('path');
var ejs = require('ejs');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var InstallableNpm = require('./../services/installable_npm');
var log = console.log;

function createApp (appName, options) {
    log();

    var inpm = new InstallableNpm();

    if (options.skipNpm) {
        createAppDirectory(appName);
    } else {
        log('Checking npm for availability of %s'.info, appName);
        inpm.available(appName, function (err) {
            if (err) {
                return log(err.message.error);
            }

            createAppDirectory(appName);
        });
    }
}

function createAppDirectory (appName) {
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

                // hack for webpack regexp based require
                // See installable-browser-plugins-loader code
                fs.renameSync(
                    directory + '/client-code',
                    directory + '/client'
                );

                var packageTemplatePath =
                    directory + '/' + 'package.ejs';

                var installableVersion =
                    require('./../../package.json').version;

                fs.writeFileSync(
                    directory + '/' + 'package.json',
                    ejs.render(
                        fs.readFileSync(
                            packageTemplatePath, 'utf8'
                        ),
                        {
                            appName: appName,
                            installableVersion: installableVersion
                        }
                    )
                );

                fs.unlinkSync(packageTemplatePath);

                log('Your application structure is ready'.info);
            }
        );

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
    });
}

module.exports = createApp;
