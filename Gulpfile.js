var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

var files = [
    'lib/*.js',
    'lib/api/**/*.*',
    'lib/cli/**/*.*',
    'lib/utils/**/*.js',
    'templates/**/*.js',
    'specs/**/*.js'
];

// Lint Task
gulp.task('lint', function() {
    return gulp.src(files)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// jscs Task
gulp.task('jscs', function() {
    return gulp.src(files)
        .pipe(jscs());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(files, ['lint', 'jscs']);
});

// Default Task
gulp.task('default', ['lint', 'jscs', 'watch']);
