'use strict';

const gulp = require('gulp');
const Server = require('karma').Server;
const pkg = require('./package.json');
const plugins = require('gulp-load-plugins')();
const runSequence = require('run-sequence');
const del = require('del');
const stylish = require('jshint-stylish');

const mainFiles = [
  'src/kairos.js',
  'src/engine/Gnomon.js'
];

gulp.task('init', () => {
  return plugins.bower();
});

gulp.task('build', done => {
  return runSequence('clean', 'build-raw', 'build-min', 'build-debug', 'build-nodejs', done);
});

gulp.task('build-raw', () => {
  return gulp.src(mainFiles)
    .pipe(plugins.concat('kairos.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-min', () => {
  return gulp.src(mainFiles)
    .pipe(plugins.uglify({
      preserveComments: 'some'
    }))
    .pipe(plugins.concat('kairos-min.js'))
    .pipe(banner())
    .pipe(plugins.stripDebug())
    .pipe(gulp.dest('build'));
});

gulp.task('build-debug', () => {
  return gulp.src(mainFiles)
    .pipe(plugins.concat('kairos-debug.js'))
    .pipe(banner())
    .pipe(gulp.dest('build'));
});

gulp.task('build-nodejs', () => {
    return gulp.src('src/kairos.js')
    .pipe(plugins.include())
      .on('error', console.log)
    .pipe(plugins.concat('kairos-node.js'))
    .pipe(banner())
    .pipe(gulp.dest('build'));
});

gulp.task('clean', done => {
  del(['build']).then(() => {
    done();
  });
});

gulp.task('docs', () => {
  return gulp.src(['src/**/*.js', 'README.md'])
    .pipe(plugins.jsdoc('docs'));
});

gulp.task('format', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.esformatter())
    .pipe(gulp.dest('src'));
});

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(stylish))
    .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('serve', () => {
  return gulp.src('./')
    .pipe(plugins.webserver({
      directoryListing: true,
      open: true,
      port: process.env.PORT || '8000',
      host: process.env.IP || 'localhost'
    }));
});

gulp.task('watch', ['build', 'serve'], () => {
  gulp.watch(['src/**/*'], ['build']);
});

gulp.task('test', done => {
  new Server({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test-watch', done => {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

// Private helpers
// ===============

const banner = () => {
  let stamp = [
    '/**',
    ' * Kairos.js - <%= pkg.description %>',
    ' * @author <%= pkg.author.name %> <<%= pkg.author.email %>>',
    ' * @version v<%= pkg.version %>',
    ' * @link https://github.com/kairos',
    ' * @license BSD',
    ' */',
    ''
  ].join('\n');

  return plugins.header(stamp, {
    pkg: pkg
  });
}
