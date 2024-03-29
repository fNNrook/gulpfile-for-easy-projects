const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync');
const concat = require('gulp-concat');
const del = require('del');
const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const minify = require('gulp-minify');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps')
const validator = require('gulp-html');

gulp.task('sass', async function () {
  return gulp.src('./src/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream({
      match: '**/*.css'
    }));
})

gulp.task('sass:production', async function () {
  const options = {
    outputStyle: 'compressed'
  }

  return gulp.src('./src/scss/**/*.scss')
    .pipe(sass(options).on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest('./dist/css'))
})

gulp.task('html', async function () {
  return gulp.src('./src/**/*.html')
    .pipe(validator())
    .pipe(gulp.dest('./dist'))
})

gulp.task('html:production', async function () {
  return gulp.src('./src/**/*.html')
    .pipe(validator())
    .pipe(htmlmin())
    .pipe(gulp.dest('./dist'))
})

gulp.task('image', async function () {
  return gulp.src('./src/img/*.*')
    .pipe(gulp.dest('./dist/img'))
})

gulp.task('image:production', async function () {
  return gulp.src('./src/img/*.*')
    .pipe(gulp.dest('./dist/img'))
})

gulp.task('clean', async function (callback) {
  del('./dist')
    .then(function () {
      callback()
    })
})

gulp.task('javascript', async function () {
  return gulp.src('./src/js/*.js')
    .pipe(concat('bundle.js'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('default', gulp.parallel('sass', 'html', 'javascript', 'image'))

gulp.task('watch', gulp.series('default', async function () {
  gulp.watch('./src/**/*.scss', gulp.series('sass'))
  gulp.watch('./src/**/*.js', gulp.series('javascript'))
  gulp.watch('./src/**/*.*', gulp.series('image'))
  gulp.watch('./src/**/*.html', gulp.series('html', async function (done) {
    browserSync.reload()
    done()
  }))

  browserSync({
    server: {
      baseDir: 'dist'
    }
  })
}))

gulp.task('production', gulp.series(
  'clean',
  gulp.parallel(
    'sass:production',
    'html:production',
    'image:production',
    'javascript'
  )
))