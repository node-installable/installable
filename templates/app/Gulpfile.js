'use strict';
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var jshint = require('gulp-jshint');
var rimraf = require('gulp-rimraf');
var webpack = require('gulp-webpack');
var karma = require('karma').server;
var mocha = require('gulp-mocha');

gulp.task('server-spec', function () {
    return gulp.src([
            './server/**/*.js',
        ], {read: false})
        .pipe(mocha({reporter: 'spec'}));
});

/**
 * Run test once and exit
 */
gulp.task('client-spec', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

/**
 * Watch for file changes and re-run tests on each change
 */
gulp.task('client-spec-watch', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js'
    }, done);
});

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
        env: { 'NODE_ENV': 'development', 'PORT': 3001 },
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
    gulp.watch(['./client/src/**/*.js',
                './client/spec/**/*.js',
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

gulp.task('tdd', function () {
    gulp.start('watch');
    gulp.start('server-development');
    // client specs
    gulp.watch(['./client/src/**/*.js',
                './client/spec/**/*.js'],
                ['client-spec-watch']);
    // server specs
    gulp.watch('./server/**/*.js', ['server-spec']);
});
