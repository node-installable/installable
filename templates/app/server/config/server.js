'use strict';

var path = require('path');

// Hapi.Server options
module.exports = {
    security: true,
    router: {
        stripTrailingSlash: true
    },
    files: {
        relativeTo: path.resolve(__dirname + '/../../browser')
    }
    // cache: require('catbox-redis'),
    // cors: true
};
