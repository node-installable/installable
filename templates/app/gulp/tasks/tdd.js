'use strict';
var gulp = require('gulp');

var config = require('../config');

gulp.task('tdd', function () {
    gulp.start('watch');
    // client specs
    gulp.watch(config.watch.clientSpecs, ['client-spec']);

    // server/common specs
    var files = [];
    files = files.concat(config.watch.commonSpecs);
    files = files.concat(config.watch.serverSpecs);

    gulp.watch(files, ['server-common-spec']);
});
