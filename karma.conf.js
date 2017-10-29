process.env.CHROME_BIN = require('puppeteer').executablePath();
const webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    singleRun: true,
    browsers: ['ChromeHeadless'],
    frameworks: ['jasmine'],

    files: [
      'test/setup_unit.js' // This file will load all of our tests
    ],

    preprocessors: {
     'test/setup_unit.js': ['webpack', 'sourcemap']
    },

    reporters: ['progress', 'nyan', 'coverage'],

    coverageReporter: {
      reporters: [
        { type: "text-summary" }
      ]
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    }
  })
};