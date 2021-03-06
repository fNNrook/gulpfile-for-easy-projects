const gulp = require('gulp'); 
const sass = require('gulp-sass');
const browserSync = require('browser-sync');

gulp.task('sass', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist'))
    .pipe(browserSync.stream({ match: '**/*.css' }));
})

gulp.task('html', function() {
  return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'))
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