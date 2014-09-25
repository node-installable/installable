'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rimraf = require('gulp-rimraf'),
    webpack = require('gulp-webpack');

gulp.task('lint', function () {
    gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('webpack', function() {
    return gulp.src('./src/main.js')
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('copy-index', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./dist/'));
});

gulp.task('clean', function () {
    return gulp.src('./dist/*.*', {read: false})
        .pipe(rimraf());
});

gulp.task('watch', function() {
    // clean
    gulp.start('clean');

    // lint
    gulp.watch(['./src/**/*.js',
                './src/**/*.jsx',
                './*.js',
                '!./dist/*.js'
                ], ['lint']);

    // webpack
    gulp.watch('./src/**/*.*', ['webpack']);
    gulp.start('webpack');

    // index.html
    gulp.watch('./src/index.html', ['copy-index']);
    gulp.start('copy-index');
});


gulp.task('default', ['watch']);
