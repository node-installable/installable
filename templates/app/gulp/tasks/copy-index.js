'use strict';
var gulp = require('gulp');
var config = require('../config');

gulp.task('copy-index', function () {
    return gulp.src(config.client.src + '/index.html')
        .pipe(gulp.dest(config.client.dist));
});
