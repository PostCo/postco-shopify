const Dotenv = require('dotenv-webpack')
const path = require('path')
const webpack = require("webpack")
const WebpackDevServer = require('webpack-dev-server')

const config = {
  context: path.resolve(__dirname, './src'),
  entry: {
    index: ['./index.js'],
  },
	devtool: 'source-map',
	output: {
    path: path.resolve(__dirname, './build'),
		filename: '[name].min.js',
		publicPath: __dirname + '/'
	},
  devServer: {
    contentBase: path.join(__dirname, "/"),
    hot: true,
    debug: true,
    compress: true,
    port: 5000
  },
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					presets: ["es2015"],
				}
			}
		]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			beautify: false,
			comments: false,
			compress: {
				warnings: false,
				drop_console: false
			},
			mangle: {
				except: ['$'],
				screw_ie8 : true,
				keep_fnames: true
      },
    }),
    new Dotenv()
	]
}

module.exports = config
