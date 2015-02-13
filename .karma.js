// Karma configuration
// Generated on Thu Feb 12 2015 23:54:18 GMT+0300 (MSK)

var pkg = require("./package.json");

module.exports = function(config) {

  var customLaunchers = {
    sl_chrome: {
      base: 'SauceLabs',
      browserName: 'chrome',
      platform: 'Windows 8.1'
    },
    sl_firefox: {
      base: 'SauceLabs',
      browserName: 'firefox',
      platform: 'Windows 8.1'
    },
    sl_opera: {
      base: 'SauceLabs',
      browserName: 'opera',
      platform: 'Windows 7'
    },
    sl_safari: {
      base: 'SauceLabs',
      browserName: 'safari'
    },
    "sl_ios_8": {
      base: "SauceLabs",
      browserName: "iPhone",
      platform: "OS X 10.10",
      version: "8.1"
    },
    sl_android: {
      base: 'SauceLabs',
      browserName: 'android'
    },
    sl_ie_9: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2008',
      version: '9'
    },
    sl_ie_10: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 2012',
      version: '10'
    },
    sl_ie_11: {
      base: 'SauceLabs',
      browserName: 'internet explorer',
      platform: 'Windows 8.1',
      version: '11'
    }
  };

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha'],

    // list of files / patterns to load in the browser
    files: [
      'web-test/test.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['saucelabs'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // launchers
    customLaunchers: customLaunchers,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['Chrome', 'PhantomJS', 'Safari', 'Firefox'],
    browsers: Object.keys(customLaunchers),

    // sauce config
    sauceLabs: {
      testName: pkg.name + "@" + pkg.version
    },

    // increase timeout
    captureTimeout: 240000,

    // increase timeout
    browserNoActivityTimeout: 90000,

    // increase timeout
    browserDisconnectTimeout: 10000,

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
