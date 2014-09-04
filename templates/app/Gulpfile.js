'use strict';

var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    jshint = require('gulp-jshint'),
    recess = require('gulp-recess'),
    less = require('gulp-less'),
    gutil = require('gulp-util'),
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

gulp.task('less', function () {
    var r = recess(),
        l = less();

    r.on('error', function (e) {
        gutil.log(e.message);
        r.end();
    });

    l.on('error', function (e) {
        gutil.log(e.message);
        l.end();
    });

    return gulp.src('./browser/styles/main.less')
        .pipe(r)
        .pipe(l)
        .pipe(gulp.dest('./browser/build/'));
});

gulp.task('webpack', function() {
  return gulp.src('./browser/scripts/main.js')
    .pipe(webpack({
        output: {
            filename: 'main.js'
        }
    }))
    .pipe(gulp.dest('./browser/build/'));
});

gulp.task('watch', function() {
    // lint
    gulp.watch(['./browser/**/*.js',
                './server/**/*.js',
                './specs/**/*.js',
                './*.js'], ['lint']);

    // less
    gulp.watch('./browser/styles/**/*.less', ['less']);
    gulp.start('less');

    // webpack
    gulp.watch('./browser/scripts/**/*.js', ['webpack']);
    gulp.start('webpack');
});


gulp.task('default', ['watch', 'server-development']);
