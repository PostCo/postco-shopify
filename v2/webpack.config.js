var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var path = require('path');

var host = '0.0.0.0';
var port = '9000';

var config = {
  entry: './src',
  devtool: 'source-map',
  output: {
    path: __dirname + '/build',
    filename: 'index.min.js',
    publicPath: __dirname + '/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ["es2015"],
        }
      }
    ]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['.js']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true
      },
      mangle: {
        except: ['$'],
        screw_ie8 : true,
        keep_fnames: true
      }
    })
  ]
}

new WebpackDevServer(webpack(config), {
  contentBase: './',
  hot: true,
  debug: true
}).listen(port, host, function (err, result) {
  if (err) {
    console.log(err);
  }
});

console.log('-------------------------');
console.log('Local web server runs at http://' + host + ':' + port);
console.log('-------------------------');

module.exports = config;
