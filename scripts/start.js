// Note: If you modify this file you must restart the run script to see your changes
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

// Dev - Restart server on changes
const startServerDev = _.once(function () {
  const nodemon = require('nodemon');
  nodemon({
    script: 'src/server/index.js',
    watch: ['src/server', 'src/html_template.js'],
    ext: 'js json'
  });

  nodemon.on('start', function () {
    console.log('Server has started');
  }).on('quit', function () {
    console.log('Server has quit');
  }).on('restart', function (files) {
    console.log('Server restarted due to: ', files);
  });
});

// Prod - Start server once
const startServerProd = _.once(function () {
  require('../src/server');
});

// Prod with no node backend - Write index.html to file
const writeIndexHtml = function () {
  fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), htmlTemplate());
  console.log('index.html has been written');
};

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

  if (isDev) {
    startServerDev();
  } else if (appConfig.useServerInProd) {
    startServerProd();
  } else {
    writeIndexHtml();
  }
};

if (isDev) {
  webpack(webpackConfig).watch({}, webpackCb);
} else {
  webpack(webpackConfig, webpackCb);
}
