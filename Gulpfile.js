'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var mocha = require('gulp-spawn-mocha');

var files = [
    'index.js',
    'Gulpfile.js',
    'lib/*.js',
    'lib/api/**/*.*',
    'lib/cli/**/*.*',
    'lib/utils/**/*.js',
    'lib/services/*.js',
    'templates/**/*.js',
    'spec/**/*.js'
];

var specs = [
    'spec/**/*.js'
];

gulp.task('lint', function () {
    return gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('jscs', function () {
    return gulp.src(files)
        .pipe(jscs());
});

gulp.task('spec', function () {
    return gulp.src(specs, {read: false})
    .pipe(mocha({
        reporter: 'spec'
    }));
});

gulp.task('coverage', function () {
    return gulp.src(specs, {read: false})
    .pipe(mocha({
        reporter: 'spec',
        istanbul: true
    }));
});

gulp.task('watch', function () {
    gulp.watch(files, ['lint', 'jscs', 'spec']);
});

gulp.task('default', ['lint', 'jscs', 'watch']);
