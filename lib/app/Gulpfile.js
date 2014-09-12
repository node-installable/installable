'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    webpack = require('gulp-webpack');

gulp.task('lint', function () {
    gulp.src('./src/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('webpack', function() {
    return gulp.src('./src/main.js')
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest('./build/'));
});

gulp.task('copy-index', function () {
    return gulp.src('./src/index.html')
        .pipe(gulp.dest('./build/'));
});

gulp.task('clean', function () {
    return gulp.src('./build/*.*', {read: false})
        .pipe(clean());
});

gulp.task('watch', function() {
    // clean
    gulp.start('clean');

    // lint
    gulp.watch(['./src/**/*.js',
                './src/**/*.jsx',
                './*.js',
                '!./build/*.js'
                ], ['lint']);

    // webpack
    gulp.watch('./src/**/*.*', ['webpack']);
    gulp.start('webpack');

    // index.html
    gulp.watch('./src/index.html', ['copy-index']);
    gulp.start('copy-index');
});


gulp.task('default', ['watch']);
