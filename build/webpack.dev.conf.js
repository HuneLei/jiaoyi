var utils = require('./utils');
var webpack = require('webpack');
var config = require('../config');
var merge = require('webpack-merge');
var baseWebpackConfig = require('./webpack.base.conf');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
  baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name]);
});

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
    }),
  },
  // cheap-module-eval-source-map is faster for development
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin(),
  ],
});

var keys = Object.keys(baseWebpackConfig.entry);
for (let i = 0; i < keys.length; i += 1) {
  const item = keys[i];
  // generate dist index.html with correct asset hash for caching.
  // you can customize output by editing /index.html
  // see https://github.com/ampedandwired/html-webpack-plugin
  webpackConfig.plugins.push(
    new HtmlWebpackPlugin({
      title: item,
      filename: item === 'app' ? 'index.html' : `${item}/index.html`,
      template: 'index.html',
      chunks: [item],
      inject: true,
      favicon: 'src/assets/img/qywico.png',
    }),
  );
}

module.exports = webpackConfig;
