var gulp = require('gulp'),
    jshint = require('gulp-jshint');

// Lint Task
gulp.task('lint', function() {
    return gulp.src(['lib/*.js',
                    'lib/api/**/*.*',
                    'lib/cli/**/*.*',
                    'templates/**/*.js',
                    'specs/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['lib/*.js',
                'lib/api/**/*.*',
                'lib/cli/**/*.*',
                'templates/**/*.js',
                'specs/**/*.js'], ['lint']);
});

// Default Task
gulp.task('default', ['lint', 'watch']);
