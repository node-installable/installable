// Karma configuration
module.exports = function (config) {
    'use strict';
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: __dirname,


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'sinon-chai'],


        // list of files / patterns to load in the browser
        files: [
            './../spec/**/*.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type: 'html',
            dir: './../../coverage/'
        },


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR
        // || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

         // add webpack as preprocessor
        preprocessors: {
            './../spec/**/*.js': ['webpack'],
            './../src/**/*.js': ['coverage']
        },

        webpack: require('./webpack.test.config'),

        webpackServer: {
            // webpack-dev-server configuration
            // webpack-dev-middleware configuration
        },

        // the port used by the webpack-dev-server
        // defaults to "config.port" + 1
        webpackPort: 1234,

        plugins: [
            'karma-*'
        ]
    });
};
