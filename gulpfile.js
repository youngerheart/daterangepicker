var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var minifyCss = require('gulp-minify-css');
var browserify = require('gulp-browserify');
var babelify = require('babelify');
var concat  = require('gulp-concat');
var runSequence = require('run-sequence');
var usemin = require('gulp-usemin');
var rev = require('gulp-rev');
var eslint = require('gulp-eslint');
var autoprefixer = require('gulp-autoprefixer');

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

gulp.task('usemin', function() {
  return gulp.src('index.html').pipe(usemin({
    js: [rev()],
    libjs: [rev()],
    css: [minifyCss(), rev()]
  })).pipe(gulp.dest('dist/deploy'));
});

gulp.task('compile.css', function(done) {
  return sass('./src/main.scss', {style: 'expanded'})
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(concat('base.css'))
  .pipe(gulp.dest('dist'));
});

gulp.task('compile.js', function() {
  return gulp
  .src(['./index.js'])
  .pipe(browserify({
    transform: [babelify]
  }))
  .pipe(gulp.dest('dist'));
});

gulp.task('compile', function(done) {
  runSequence([
    'compile.css',
    'compile.js'
  ], done);
});

gulp.task('watch.css', lazyWatch(['./src/**/*.scss', './src/**/*.css'], 'compile.css'));
gulp.task('watch.js', lazyWatch(['./index.js', './src/**/*.js'], 'compile.js'));

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
  console.log('请访问dt.test.ele.me');
});

gulp.task('deploy', function(done) {
  runSequence('compile', 'usemin', done);
});

gulp.task('help', function() {
  setTimeout(function() {
    console.log('');
    console.log('=========== gulp 使用说明 ===========');
    console.log(' $ gulp help    # gulp 使用说明');
    console.log(' $ gulp build   # 生成文件');
    console.log(' $ gulp dev     # 进入一般开发环境');
    console.log(' $ gulp publish # 压缩打包代码');
    console.log('=====================================');
  });
});

gulp.task('default', ['help']);
