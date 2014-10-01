'use strict';
var gulp = require('gulp');

var config = require('../config');

gulp.task('watch', function () {
    // lint
    gulp.watch(config.lint, ['lint', 'jscs']);
});
