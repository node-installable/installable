'use strict';

module.exports = function (installable) {
    return new ServerController(installable);
};

function ServerController (installable) {
    this.installable = installable;
}

ServerController.prototype.restart = function (req, res) {
    res.json({ok: true});
    this.installable.restartApplication();
};
