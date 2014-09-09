'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    clean = require('gulp-clean'),
    webpack = require('gulp-webpack');

gulp.task('lint', function () {
    gulp.src([
            './browser/**/*.js',
            './server/**/*.js',
            './*.js',
            '!./browser/build/**/*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('server-development', function () {
    nodemon({
        script: './server/index.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' },
        nodeArgs: ['--debug'],
        ignore: ['browser/*'],
    })
    .on('change', ['lint'])
    .on('restart', function () {
        console.log('Nodemon restarted server!');
    });
});

gulp.task('webpack', function() {
  return gulp.src('./browser/main.js')
    .pipe(webpack({
        output: {
            filename: 'build.js'
        }
    }))
    .pipe(gulp.dest('./browser/build/'));
});

gulp.task('copy-index', function () {
    return gulp.src('./browser/index.html')
        .pipe(gulp.dest('./browser/build/'));
});

gulp.task('clean', function () {
    return gulp.src('./browser/build/*.*', {read: false})
        .pipe(clean());
});

gulp.task('watch', function() {
    // clean
    gulp.start('clean');

    // lint
    gulp.watch(['./browser/**/*.js',
                './server/**/*.js',
                './specs/**/*.js',
                './*.js'], ['lint']);

    // webpack
    gulp.watch(['./browser/**/*.js',
                './browser/**/*.less',
                '!./browser/build/*.js'], ['webpack']);
    gulp.start('webpack');

    // index.html
    gulp.watch('./browser/index.html', ['copy-index']);
    gulp.start('copy-index');
});


gulp.task('default', ['watch', 'server-development']);
