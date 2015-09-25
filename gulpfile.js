'use strict';

var gulp = require('gulp');
var bower = require('gulp-bower');
var karma = require('karma').server;
var pkg = require('./package.json');
var plugins = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var del = require('del');
var stylish = require('jshint-stylish');
var mainBowerFiles = require('main-bower-files');

var mainFiles = [
  'src/kairos.js'
];

gulp.task('init', function () {
  return bower();
});

gulp.task('build', ['clean'], function () {
  return runSequence('bower-files', 'build-raw', 'build-min', 'build-debug', 'build-css');
});

gulp.task('bower-files', function () {
  return gulp.src(mainBowerFiles()).pipe(gulp.dest('src/vendor'));
});

gulp.task('build-css', function () {
  return gulp.src('src/keypane.css')
    .pipe(plugins.csso())
    .pipe(plugins.autoprefixer('last 3 version'))
    .pipe(gulp.dest('build'));
});

gulp.task('build-raw', function () {
  return gulp.src(mainFiles)
    .pipe(resolveDependencies())
    .pipe(plugins.concat('kairos.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-min', function () {
  return gulp.src(mainFiles)
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(resolveDependencies())
    .pipe(plugins.concat('keypane-min.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-debug', function () {
  return gulp.src(mainFiles)
    .pipe(resolveDependencies())
    .pipe(plugins.concat('keypane-debug.js'))
    .pipe(banner())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', function (cb) {
  del(['build'], cb);
});

gulp.task('docs', function () {
  return gulp.src(['src/**/*.js', 'README.md'])
    .pipe(plugins.jsdoc('docs'));
});

gulp.task('format', function () {
  return gulp.src(['src/**/*.js', '!src/vendor/**'])
    .pipe(plugins.esformatter())
    .pipe(gulp.dest('src'));
});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', '!src/vendor/**'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('serve', function () {
  return gulp.src('./')
    .pipe(plugins.webserver({
      directoryListing: true,
      open: true
    }));
});

gulp.task('watch', ['build', 'serve'], function () {
  gulp.watch(['src/**/*', '!src/vendor/**'], ['build']);
});

gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

gulp.task('test-watch', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js'
  }, done);
});

// Private helpers
// ===============

function banner() {
  var stamp = [
    '/**',
    ' * Kairos.js - <%= pkg.description %>',
    ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' * @version v<%= pkg.version %>',
    ' * @link https://github.com/Sedentary/keypane',
    ' * @license BSD',
    ' */',
    ''
  ].join('\n');

  return plugins.header(stamp, {
    pkg: pkg
  });
}

function resolveDependencies() {
  return plugins.resolveDependencies({
    pattern: /\* @requires [\s-]*(.*\.js)/g
  })
    .on('error', function (err) {
      console.log(err.message);
    });
}
