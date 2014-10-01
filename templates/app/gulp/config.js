'use strict';
// all paths relative to root since
// gulp is call from there
var clientDist = './client/dist';
var clientSrc = './client/src';
var clientSpec = './client/spec';
var clientConfig = './client/config';

var serverSrc = './server/src';
var serverSpec = './server/spec';

var commonSrc = './common/src';
var commonSpec = './common/spec';

module.exports = {
    client: {
        dist: clientDist,
        src: clientSrc,
        spec: clientSpec,
        config: clientConfig
    },
    server: {
        src: serverSrc,
        spec: serverSpec
    },
    common: {
        src: commonSrc,
        spec: commonSpec
    },
    lint: [
        clientSrc + '/**/*.js',
        clientSpec + '/**/*.js',
        clientConfig + '/**/*.js',
        serverSrc + '/**/*.js',
        serverSpec + '/**/*.js',
        commonSrc + '/**/*.js',
        commonSpec + '/**/*.js',
        './*.js',
        './gulp/**/*.js'
    ],
    webpack: {
        main: clientSrc + '/main.js',
        config: __dirname + '/../client/config/webpack.config.js',
        dist: clientDist
    },
    specs: {
        server: serverSpec + '/**/*.js',
        common: commonSpec + '/**/*.js'
    },
    karma: {
        config: __dirname + '/../client/config/karma.conf.js'
    },
    nodemon: {
        script: serverSrc + '/index.js',
        ignore:[// no ./ in nodemon's paths
            'client/**',
            'node_modules/**',
            'server/spec/**',
            'common/spec/**',
            'gulp/**'
        ]
    },
    watch: {
        webpack: [
            clientSrc + '/**/*.js',
            clientConfig + '/**/*.js',
            commonSrc + '/**/*.js'
        ],
        clientSpecs: [
            clientSrc + '/**/*.js',
            clientSpec + '/**/*.js',
            clientConfig + '/**/*.js',
            commonSrc + '/**/*.js'
        ],
        commonSpecs: [
            commonSrc + '/**/*.js',
            commonSpec + '/**/*.js'
        ],
        serverSpecs: [
            serverSrc + '/**/*.js',
            serverSpec + '/**/*.js'
        ]
    }
};
