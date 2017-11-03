// Client unit test config
process.env.CHROME_BIN = require('puppeteer').executablePath();
const webpackConfig = require('./webpack.config');

module.exports = function (config) {
  config.set({
    singleRun: true,
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha'],

    files: [
      'test/setup_client.js' // This file will load all of our tests
    ],

    preprocessors: {
     'test/setup_client.js': ['webpack', 'sourcemap']
    },

    reporters: ['mocha', 'coverage'],

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