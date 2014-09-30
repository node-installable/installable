'use strict';
var gulp = require('gulp');
var webpack = require('gulp-webpack');

var config = require('../config');

gulp.task('webpack', function () {
    return gulp.src(config.webpack.main)
        .pipe(webpack(require(config.webpack.config)))
        .pipe(gulp.dest(config.webpack.dist));
});
