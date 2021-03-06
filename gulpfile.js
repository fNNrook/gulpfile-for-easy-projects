const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps')
const validator = require('gulp-html');

gulp.task('sass', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer())
      .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
})

gulp.task('sass:production', function() {
  const options = {
    outputStyle: 'compressed'
  }

  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass(options).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('html', function() {
  return gulp.src('./src/**/*.html')
    .pipe(validator())
    .pipe(gulp.dest('./dist'))
})

gulp.task('html:production', function() {
  return gulp.src ('./src/**/*.html')
    .pipe(validator())
    .pipe(htmlmin())
    .pipe(gulp.dest('./dist'))
})

gulp.task('clean', function(callback) {
  del('./dist')
    .then(function() {
      callback()
    })
})

gulp.task('default', gulp.parallel('sass', 'html'))

gulp.task('watch', function() {
  gulp.watch('./src/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/**/*.html', gulp.series('html', function(done) {
    browserSync.reload()
    done()
  }))

  browserSync({
    server: {
      baseDir: 'dist'
    }
  })
})

gulp.task('production', gulp.series(
  'clean',
  gulp.parallel(
    'sass:production',
    'html:production'
  )
))