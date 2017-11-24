// Note: If you modify this file you must restart the run script to see your changes
const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const appConfig = require('../src/config');

const NODE_ENV = process.env.NODE_ENV;
const isDev = (NODE_ENV === 'development');
const isProd = (NODE_ENV === 'production');

// Dev - Restart server on changes
const startServerDev = _.once(function () {
  const nodemon = require('nodemon');
  nodemon({
    script: 'src/server/index.js',
    watch: ['src/server'],
    ext: 'js json'
  });

  nodemon.on('start', function () {
    console.log('Server has started');
  }).on('restart', function (files) {
    console.log('Server restarted due to: ', files);
  }).on('quit', function () {
    process.exit(0); // Some weirdness seems to happen without this (at least on linux)
  });
});

// Prod - Start server once
const startServerProd = _.once(function () {
  require('../src/server');
});

// Prod with no node backend - Write index.html to file
const writeIndexHtml = function () {
  const htmlTemplate = require('../src/server/html_template'); // require AFTER the manifest is written
  fs.writeFileSync(path.resolve(__dirname, '../dist/index.html'), htmlTemplate());
  console.log('index.html has been written');
};

const webpackCb = function (err, stats) {
  if (err) {
    console.log('----ERROR BUNDLING WEBPACK----');
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
