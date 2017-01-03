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
  'process.env': { NODE_ENV: JSON.stringify(NODE_ENV) }
});

let config = {
  context: path.join(__dirname, 'src'),
  entry: {
    app: ['./init_app.js'],
    vendor: ['babel-polyfill', 'react', 'react-dom']
  },
  resolve: {
    modulesDirectories: ['src', 'src/components', 'node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  output: {
    publicPath: appConfig.publicPath,
    path: path.join(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  plugins: [
    definePlugin,
    new ManifestPlugin(),
    new CleanWebpackPlugin(['dist/**/*']),
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.[chunkhash].js'),
    new ExtractTextPlugin('[name].[chunkhash].css')
  ],
  // An eval sourcemap is the fastest for rebuilding, but will not emit nice sass sourcemaps,
  // so change "eval" to "inline-source-map" for nice scss sourcemaps
  devtool: isProd ? 'source-map' : 'eval',
  module: {
    loaders: [
      {
        include: [path.resolve(__dirname, 'src')],
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          cacheDirectory: path.resolve('./.tmp'),
          retainLines: true,
          presets: ['es2015', 'react', 'stage-0']
       }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap')
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?sourceMap', 'sass-loader?sourceMap')
      },
      {
       test: /\.(png|jpg|gif|svg|ttf|eot|woff2?)$/,
       loaders: ['file?name=[name].[hash].[ext]']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
   ]
 }
};

if (isTest) {
  let newConfig = _.pick(config, 'context', 'resolve');

  Object.assign(newConfig, {
    devtool: 'inline-source-map',
    module: {
      plugins: [
        definePlugin
      ],
      loaders: [
        _.find(config.module.loaders, { loader: 'babel' }),
        // Ignore asset filetypes to speed up bundling
        {
          test: /\.(less|scss|css|png|jpg|gif|svg|ttf|eot|woff2)$/,
          loader: 'null'
        },
        _.find(config.module.loaders, { loader: 'json-loader' })
      ],
      postLoaders: [
        {
          test: /\.jsx?$/,
          include: path.resolve(__dirname, 'src'),
          exclude: /\.test\.jsx?$/,
          loader: 'istanbul-instrumenter'
        }
      ]
    }
  });

 config = newConfig;
}

module.exports = config;