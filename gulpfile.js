var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var rename = require("gulp-rename");
var browserify = require('gulp-browserify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var runSequence = require('run-sequence');
var eslint = require('gulp-eslint');

var lazyWatch = function(glob, task) {
  return function() {
    var tick;
    gulp.watch(glob, function() {
      if(tick) return;
      tick = setTimeout(function() {
        runSequence(task);
        tick = void 0;
      });
    });
  };
};

gulp.task('compile.css', function(done) {
  return sass('./src/main.scss', {style: 'expanded'})
  .pipe(minifyCss({compatibility: 'ie8'}))
  .pipe(rename('daterangepicker.min.css'))
  .pipe(gulp.dest('dist'));
});

gulp.task('compile.js', function() {
  return gulp
  .src('./src/index.js')
  .pipe(browserify({
    transform: [babelify]
  }))
  .pipe(uglify())
  .pipe(rename('daterangepicker.min.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('require.js', function() {
  return gulp
  .src('./src/DateRangePicker.js')
  .pipe(browserify({
    transform: [babelify]
  }))
  .pipe(uglify())
  .pipe(rename('index.js'))
  .pipe(gulp.dest('dist'));
});

gulp.task('compilelint.js', function(done) {
  runSequence([
    'compile.js',
    'require.js',
    'lint'
  ], done);
});

gulp.task('compile', function(done) {
  runSequence([
    'compile.css',
    'compile.js',
    'require.js',
    'lint'
  ], done);
});

gulp.task('lint', function() {
  return gulp
  .src([
    './src/**/*.js',
  ])
  .pipe(eslint())
  .pipe(eslint.format());
});

gulp.task('watch.css', lazyWatch(['./src/**/*.scss', './src/**/*.css'], 'compile.css'));
gulp.task('watch.js', lazyWatch(['./index.js', './src/**/*.js'], 'compilelint.js'));

gulp.task('watch', function(done) {
  runSequence([
    'watch.css',
    'watch.js'
    ]);
});

gulp.task('build', function(done) {
  runSequence([
    'compile'
    ],  done);
});

gulp.task('dev', [ 'build' ], function(done) {
  runSequence([ 'watch' ], done);
  console.log('请访问example/index.html');
});

gulp.task('help', function() {
  setTimeout(function() {
    console.log('');
    console.log('=========== gulp 使用说明 ===========');
    console.log(' $ gulp help    # gulp 使用说明');
    console.log(' $ gulp build   # 生成文件');
    console.log(' $ gulp dev     # 进入一般开发环境');
    console.log('=====================================');
  });
});

gulp.task('default', ['help']);
