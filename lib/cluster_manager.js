'use strict';
var os = require('os');
var cluster = require('cluster');

/**
 * A cluster wrapper class for managing workers
 * @constructor
 * @param {Integer|undefined} workersCount - The number of workers to fork
 */
function ClusterManager (workersCount) {
    this.workers = [];
    this.workersCount = workersCount || os.cpus().length;
}

/**
 * Forks workers
 * @public
 */
ClusterManager.prototype.fork = function () {
    for (var i = 0; i < this.workersCount; i++) {
        var worker = cluster.fork();
        worker.on('message', this.onMessage.bind(this));
        this.workers.push(worker);
    }
};

/**
 * Listener for workers' messages
 * @param {Object} message - worker's message
 * @private
 */
ClusterManager.prototype.onMessage = function (message) {
    if (message.command && message.command === 'restart') {
        this.restart();
    }
};

/**
 * Removes a worker from its internal state
 * @private
 */
ClusterManager.prototype.removeWorker = function (worker) {
    this.workers.splice(this.workers.indexOf(worker), 1);
};

/**
 * Restarts all workers
 * @private
 */
ClusterManager.prototype.restart = function () {
    this.kill();
    this.fork();
};

/**
 * Kills all workers
 * @private
 */
ClusterManager.prototype.kill = function () {
    var count = this.workers.length;

    while (count--) {
        var worker = this.workers[0];
        worker.kill();
        this.removeWorker(worker);
    }
};

module.exports = ClusterManager;
