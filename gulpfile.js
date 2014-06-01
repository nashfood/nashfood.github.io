var gulp = require('gulp');

var sass    = require('gulp-ruby-sass');
var concat  = require('gulp-concat');
var jsx     = require('gulp-react');
var uglify  = require('gulp-uglify');


gulp.task('jsx', function () {
  gulp
    .src('jsx/**/*.jsx')
    .pipe(jsx())
    .pipe(concat('jsx.js'))
    .pipe(gulp.dest('./js'));
});

gulp.task('scripts', function () {
  var path = 'js/**/*.js';
  gulp
    .src(path)
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('./'));
});

gulp.task('styles', function () {
  var path = 'sass/main.scss';

  gulp
    .src(path)
    .pipe(sass({ sourcemap: true }))
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./'));
});

gulp.task('default', ['styles', 'jsx', 'scripts']);


