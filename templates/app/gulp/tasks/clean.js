'use strict';
var gulp = require('gulp');
var rimraf = require('gulp-rimraf');

var config = require('../config');

gulp.task('clean', function () {
    return gulp.src(config.client.dist, {read: false})
        .pipe(rimraf());
});
