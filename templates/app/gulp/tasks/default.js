'use strict';
var gulp = require('gulp');

gulp.task('default', [
    'lint',
    'jscs',
    'clean',
    'copy-index',
    'webpack',
    'watch',
    'nodemon'
]);
