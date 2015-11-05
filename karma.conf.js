module.exports = function (config) {
  'use strict';

  var configuration = {
    frameworks: ['mocha'],
    files: [
      'bower_components/mocha/mocha.css',
      'src/kairos.js',
      'src/gnomon/Gnomon.js',
      'bower_components/assert/assert.js',
      'bower_components/mocha/mocha.js',
      'test/browser/kairos.js',
      'test/browser/gnomon.js',
      {
        pattern: 'test/browser/fixture/*',
        included: false,
        served: true
      }
    ],
    proxies: {
      '/fixture': '/base/test/fixture'
    },
    reporters: ['progress', 'coverage'],
    preprocessors: {
      'src/**/*.js': ['coverage']
    },
    coverageReporter: {
      dir: 'coverage',
      reporters: [
        {type: 'lcovonly', subdir: '.', file: 'lcov.info'}
      ]
    },
    browsers: ['Chrome', 'Firefox', 'PhantomJS'],
    plugins : [
      'karma-jasmine',
      'karma-mocha',
      'karma-coverage',
      'karma-phantomjs-launcher',
      'karma-chrome-launcher',
      'karma-firefox-launcher'
      ]
  };

  if (process.env.TRAVIS) {
    //configuration.customLaunchers = {
    //  Chrome_travis_ci: {
    //    base: 'Chrome',
    //    flags: ['--no-sandbox']
    //  }
    //};

    configuration.browsers = ['Firefox'/*, 'PhantomJS', 'Chrome_travis_ci'*/];
  }
  
  if (process.env.C9_PROJECT) {
    configuration.browsers = ['PhantomJS'];
  }
  
  if (process.env.IP && process.env.PORT) {
    configuration.hostname = process.env.IP;
    configuration.port = process.env.PORT
    configuration.runnerPort = 0
  }

  config.set(configuration);
};
