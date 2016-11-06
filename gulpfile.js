const del = require('del');
const gulp = require('gulp');
const glps = require('gulp-load-plugins');

const $ = glps();

gulp.task('del', function() {
  return del('docs', { force: true })
});

gulp.task('build', ['del'], function() {
  return gulp.src('index.jade')
    .pipe($.pug({ pretty: true }))
    .pipe($.usemin({
      js: [$.rev()],
      css: [$.rev()]
    }))
    .pipe(gulp.dest('docs'))
});