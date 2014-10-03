'use strict';
var os = require('os');
var cluster = require('cluster');
var EXIT_CODES = require('./exit_codes');

/**
 * ClusterManager constructor
 * A cluster wrapper class for managing workers
 * @param {Integer|undefined} workersCount [The number of workers to fork]
 */
function ClusterManager (workersCount) {
    this.workers = [];
    this.workersCount = workersCount || os.cpus().length;
    this.listen();
}

/**
 * Forks workers
 * @api public
 */
ClusterManager.prototype.fork = function () {
    for (var i = 0; i < this.workersCount; i++) {
        this.workers.push(cluster.fork());
    }
};

/**
 * Registers listener to cluster exit event
 * @api private
 */
ClusterManager.prototype.listen = function () {
    cluster.on('exit', function (worker, code) {
        this.removeWorker(worker);

        if (code === EXIT_CODES.RESTART) {
            this.restart();
        }
    }.bind(this));
};

/**
 * Removes a worker from its internal state
 * @api private
 */
ClusterManager.prototype.removeWorker = function (worker) {
    this.workers.splice(
        this.workers.indexOf(worker)
    );
};

/**
 * Restarts all workers
 * @api private
 */
ClusterManager.prototype.restart = function () {
    this.kill();
    this.fork();
};

/**
 * Kills all workers
 * @api private
 */
ClusterManager.prototype.kill = function () {
    this.workers.forEach(function (worker) {
        worker.kill();
        this.removeWorker(worker);
    }.bind(this));
};

module.exports = ClusterManager;
