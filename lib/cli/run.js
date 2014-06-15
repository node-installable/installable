var matchdep = require('matchdep');

function runApp (appName) {
    var server = require(path.normalize(appName));
    var applicationName = require('./package').name;

    var plugins = matchdep.filter(applicationName + '-plugin-*').map(function (pluginName) {
        return {
            plugin: require(pluginName)
        };
    });

    server.pack.register(plugins, function (err) {
        if (err) throw err;

        server.start(function () {
            console.log("Server started", server.info.uri);
        });
    });
}

module.exports = matchdep;