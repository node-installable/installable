'use strict';
var os = require('os');
var cluster = require('cluster');

function ClusterManager (workersCount) {
    this.workerList = [];
    this.workersCount = workersCount || os.cpus().length;
    this.listen();
}

ClusterManager.prototype.listen = function () {
    cluster.on('exit', function (worker, code) {
        this.removeWorker(worker);

        if (code === 1) {
            this.workerList.forEach(function (worker) {
                worker.kill();
                this.removeWorker(worker);
            }.bind(this));

            this.fork();
        }
    }.bind(this));
};

ClusterManager.prototype.removeWorker = function (worker) {
    this.workerList.splice(
        this.workerList.indexOf(worker)
    );
};

ClusterManager.prototype.fork = function () {
    for (var i = 0; i < this.workersCount; i++) {
        this.workerList.push(cluster.fork());
    }
};

module.exports = ClusterManager;
