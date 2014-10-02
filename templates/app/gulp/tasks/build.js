'use strict';
var gulp = require('gulp');

gulp.task('build', [
    'lint',
    'jscs',
    'clean',
    'copy-index',
    'webpack'
]);
