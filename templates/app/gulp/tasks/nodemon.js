'use strict';
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

var config = require('../config');

gulp.task('nodemon', function () {
    return nodemon({
        script: config.nodemon.script,
        ext: 'js',
        env: { NODE_ENV: 'development', PORT: 3001 },
        ignore: config.nodemon.ignore
    })
    .on('restart', function () {
        console.log('Nodemon restarted server!');
    });
});
