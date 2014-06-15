var fs = require('fs');
var path = require('path');
var npm = require('npm');
var ejs = require('ejs');
var ncp = require('ncp').ncp;
var mkdirp = require('mkdirp');
var colors = require('colors');

function createApp (appName) {
    console.log();

    npm.load(null, function () {
        console.log('Checking npm registry for module '.info + appName.highlight);

        npm.view(appName, function (error) {
            if (error) {
                if (error.code === 'E404')
                    console.log(('npm module ' + appName + ' is').info + ' available'.success);
                else
                    console.log('Failed to check module existance. Error code: ' + error.code);

                var directory = path.normalize(process.cwd() + '/' + appName);

                mkdirp(directory, function (err) {
                    if (err) return console.error(err);

                    ncp(path.join(__dirname, '/../../templates/app'), directory, function (err) {
                        if (err) return console.error(err);

                        var packageTemplatePath = directory + '/' + 'package.ejs';

                        fs.writeFileSync(
                            directory + '/' + 'package.json',
                            ejs.render(fs.readFileSync(packageTemplatePath, 'utf8'), {appName: appName})
                        );

                        fs.unlinkSync(packageTemplatePath);

                        console.log('Your application structure is ready'.info);
                        console.log('run '.info + ('`cd ' + appName + '; npm install; moog run index.js`').highlight + ' to start the server'.info);
                    });
                });
            } else {
                return console.error(('npm module ' + appName + ' already exists. Choose another name for your application.').error);
            }
        });
    });
}

module.exports = createApp;