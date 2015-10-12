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
      'test/test.js',
      {
        pattern: 'test/fixture/*',
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
    browsers: ['Chrome', 'Firefox']
  };

  if (process.env.TRAVIS) {
    configuration.customLaunchers = {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    };

    configuration.browsers = ['Firefox', 'Chrome_travis_ci'];
  }

  config.set(configuration);
};
