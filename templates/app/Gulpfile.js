'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    rimraf = require('gulp-rimraf'),
    webpack = require('gulp-webpack');

gulp.task('lint', function () {
    gulp.src([
            './client/src/**/*.js',
            './client/spec/**/*.js',
            './server/**/*.js',
            './*.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('server-development', function () {
    nodemon({
        script: './server/src/index.js',
        ext: 'js',
        env: { 'NODE_ENV': 'development' },
        nodeArgs: ['--debug'],
        ignore: ['client/*', 'node_modules/*'],
    })
    .on('change', ['lint'])
    .on('restart', function () {
        console.log('Nodemon restarted server!');
    });
});

gulp.task('webpack', function() {
    return gulp.src('./client/src/main.js')
        .pipe(webpack(require('./webpack.config')))
        .pipe(gulp.dest('./client/dist/'));
});

gulp.task('copy-index', function () {
    return gulp.src('./client/src/index.html')
        .pipe(gulp.dest('./client/dist/'));
});

gulp.task('clean', function () {
    return gulp.src('./client/dist/*.*', {read: false})
        .pipe(rimraf());
});

gulp.task('watch', function() {
    // clean
    gulp.start('clean');

    // lint
    gulp.watch(['./client/src/*.js',
                './client/spec/*.js',
                './server/**/*.js',
                './*.js'], ['lint']);

    // webpack
    gulp.watch(['./client/src/**/*.*'], ['webpack']);
    gulp.start('webpack');

    // index.html
    gulp.watch('./client/index.html', ['copy-index']);
    gulp.start('copy-index');
});


gulp.task('default', ['watch', 'server-development']);
