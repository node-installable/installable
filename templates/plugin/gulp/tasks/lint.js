'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var config = require('../config');

gulp.task('lint', function () {
    return gulp.src(config.lint)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function () {
    return gulp.src(config.lint)
        .pipe(jscs());
});
