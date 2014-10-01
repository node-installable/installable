'use strict';
var gulp = require('gulp');
var karma = require('karma').server;
var mocha = require('gulp-spawn-mocha');
var config = require('../config');

gulp.task('server-common-spec', function () {
    return gulp.src([
        config.specs.server,
        config.specs.common
    ], {read: false})
    .pipe(mocha({
        reporter: 'spec',
        istanbul: true
    }));
});

gulp.task('client-spec', function (done) {
    return karma.start({
        configFile: config.karma.config
    }, done);
});
