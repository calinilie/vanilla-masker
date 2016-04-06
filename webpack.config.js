var webpack = require('webpack')

module.exports = {
	context: __dirname + '/src',
	entry: './vanilla-masker.js',
	output: {
		path: __dirname + '/dist',
		filename: 'vanilla-masker.js'
	},
	resolve: {
		extensions: ['', '.js'],
	},
	module: {
		loaders: [{
			test: /\.(js|jsx)$/,
			loader: 'babel',
		}]
	},
	plugins: [
		new webpack.OldWatchingPlugin()
	],
}