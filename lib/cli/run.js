'use strict';

var cluster = require('cluster'),
    path = require('path'),
    matchdep = require('matchdep'),
    hapi = require('hapi'),
    gulp = require('gulp');

function runApp (indexFilePath) {
    var server,
        configPath = path.resolve(process.cwd() + '/' + indexFilePath),
        pkgPath = configPath.replace(/index.js$/, 'package.json');

    function startServer () {
        var config = require(configPath);

        // start server with app's config
        server = hapi.createServer(
            'localhost',
            process.env.PORT || config.server.port || 3000,
            config.server
        );

        // mount routes
        server.route(config.routes);

        var applicationName = require(pkgPath).name;

        var plugins = matchdep
            .filter(applicationName + '-plugin-*')
            .map(function (pluginName) {
                return {
                    plugin: require(pluginName)
                };
            }
        );

        server.pack.register(plugins, function (err) {
            if (err) {
                throw err;
            }

            server.start(function () {
                console.log('Worker server started %s'.info, server.info.uri);
            });
        });
    }

    var workerList = [],
        sigkill = false,
        count = 0,
        sigint;

    var removeWorkerFromListByPID = function (pid) {
        var counter = -1;
        workerList.forEach(function (worker) {
            ++counter;
            if (worker.process.pid === pid) {
                workerList.splice(counter, 1);
            }
        });
    };

    if (!cluster.isMaster) {
        process.on('message', function (msg) {
            if (msg.cmd && msg.cmd === 'stop') {
                console.log('Received STOP signal from master'.info);
                server.stop();
                process.exit();
            }
        });

        startServer();

    } else {
        console.log('Loading app %s'.info, configPath);

        // Count the machine's CPUs
        var cpuCount = require('os').cpus().length;

        console.log('%s CPUs detected on this machine.'.info, cpuCount);

        if (process.env.NODE_ENV === 'development') {
            cpuCount = 2;
            console.log('Reducing worker processes to %s for development.'.info,
                        cpuCount);
        }

        // Create a worker for each CP
        for (var i = 0; i < cpuCount; i++) {
            var worker = cluster.fork();
            workerList.push(worker);
        }

        process.on('SIGUSR2', function () {
            console.log('Received SIGUSR2 from system'.info);
            console.log('There are %s workers running'.info, workerList.length);
            workerList.forEach(function (worker) {
                setTimeout(function () {
                    worker.send({cmd: 'stop'});
                    console.log('Sending STOP message to worker %s'.info,
                                worker.id);
                }, 1000 * count++);
            });
            count = 0;
        });

        process.on('SIGINT', function () {
            sigint = true;
            process.exit();
        });

        cluster.on('exit', function (worker) {
            if (sigkill) {
                console.log('SIGKINT received - not respawning workers');
                return;
            }

            // force reloading of code by deleting the cached module
            delete require.cache[indexFilePath];

            var newWorker = cluster.fork();
            console.log(('Worker id %s process id %s died' + 
                        ' and it will be re-spawned').info,
                        worker.id, worker.process.pid);

            removeWorkerFromListByPID(worker.process.pid);
            workerList.push(newWorker);
        });
    }

    if (process.env.NODE_ENV === 'development') {
        gulp.task('reload', function () {
            process.emit('SIGUSR2');
        });
        gulp.watch(configPath.replace(/index.js$/, '**/*.js'), ['reload']);
    }
}

module.exports = runApp;
