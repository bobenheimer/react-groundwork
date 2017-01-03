// Note: If you modify this file you must restart webpack to see your changes
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const appConfig = require('../src/config');
const htmlTemplate = require('../src/html_template');

const NODE_ENV = process.env.NODE_ENV;
const isDev = (NODE_ENV === 'development');
const isProd = (NODE_ENV === 'production');
const useServer = isDev || appConfig.useServerInProd; // Always use in dev, use based off of config in production

const startServerOnce = _.once(function () {
  require('../src/server');
});

// todo minify
const webpackCb = function (err, stats) {
  if (err) {
    console.assert(null, err);
    return;
  }

  console.log(stats.toString({
    colors: true,
    chunks: false,
    chunkModules: false,
    modules: false
  }));

  if (useServer) {
    startServerOnce(); // todo - restart on changes
  } else {
    // todo bluebird?
    fs.writeFile(path.resolve(__dirname, '../dist/index.html'), htmlTemplate());
  }
};

if (isDev) {
  webpack(webpackConfig).watch({}, webpackCb);
} else {
  webpack(webpackConfig, webpackCb);
}
