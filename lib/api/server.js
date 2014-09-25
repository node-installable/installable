'use strict';


exports.restart = function (req, res) {
    res.json({ok: true});
    require('./../index').restartServer();
};
