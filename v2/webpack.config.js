var webpack = require('webpack');
var path = require('path');

var config = {
  entry: './src/shopify',
  devtool: 'source-map',
  output: {
    path: './build',
    filename: 'shopify.js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          plugins: ["transform-decorators-legacy"],
          presets: ["es2015", "stage-2", "stage-0"],
        }
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['.js']
  }
}

module.exports = config;
