const path = require('path');
const _ = require('lodash');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const appConfig = require('./src/config');

const NODE_ENV = process.env.NODE_ENV;
const isDev = (NODE_ENV === 'development');
const isTest = (NODE_ENV === 'test');
const isProd = (NODE_ENV === 'production');

// Common stuff used in both regular config and test only
const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(NODE_ENV),
    IS_BROWSER: true
  }
});

let config = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: ['./init_app.js'],
    vendor: ['babel-polyfill', 'react', 'react-dom']
  },
  output: {
    publicPath: appConfig.publicPath,
    path: path.join(__dirname, 'dist'),
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
    pathinfo: !isProd
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'src'),
      path.resolve(__dirname, 'src/client'),
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  plugins: [
    definePlugin,
    new ManifestPlugin(),
    new CleanWebpackPlugin(['dist/**/*']),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: isProd ? 'vendor.[chunkhash].js' : 'vendor.js'
    }),
    new ExtractTextPlugin({
      filename: isProd ? '[name].[contenthash].css' : '[name].css',
      disable: isDev
    })
  ],
  // An eval sourcemap is the fastest for rebuilding, but will not emit nice sass sourcemaps,
  // so change "eval" to "inline-source-map" for nice scss sourcemaps
  devtool: isProd ? 'source-map' : 'eval',
  module: {
    rules: [
      {
        include: [path.resolve(__dirname, 'src')],
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: path.resolve('./.tmp'),
          retainLines: true,
          presets: ['env', 'stage-0', 'react']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              query: { sourceMap: true }
            },
            {
              loader: 'sass-loader',
              query: { sourceMap: true }
            }
          ],
          fallback: 'style-loader' // Use style-loader in development
        }),
      },
      {
        test: /\.css/,
        loader: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              query: { sourceMap: true }
            }
          ],
          fallback: 'style-loader' // Use style-loader in development
        }),
      },
      {
        test: /\.(png|jpg|gif|svg|ttf|eot|woff|woff2?)$/,
        loader: 'file-loader',
        options: {
          name: isProd ? '[name].[hash].[ext]' : '[path][name].[ext]'
        }
      }
   ]
 }
};

if (isProd) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    warnings: true
  }));
}

if (isTest) {
  let newConfig = _.pick(config, 'context', 'resolve');

  Object.assign(newConfig, {
    devtool: 'inline-source-map',
    plugins: [
      definePlugin
    ],
    module: {
      rules: [
        _.find(config.module.rules, { loader: 'babel-loader' }),
        // Ignore asset filetypes to speed up bundling
        {
          test: /\.(less|scss|css|png|jpg|gif|svg|ttf|eot|woff|woff2)$/,
          loader: 'null-loader'
        },
        {
          enforce: 'post',
          test: /\.jsx?$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /\.test\.jsx?$/,
          loader: 'istanbul-instrumenter-loader'
        }
      ]
    }
  });

  config = newConfig;
}

module.exports = config;
