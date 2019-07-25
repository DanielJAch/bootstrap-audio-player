const webpack = require('webpack');
const merge = require('webpack-merge');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig('production'), {
  devtool: false,

  plugins: [
    new TerserWebpackPlugin(),
    new CompressionWebpackPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(/\.(['js', 'css'])$/),
      threshold: 10240,
      minRatio: 0.8
    })
  ]
});
