var debug = process.env.NODE_ENV !== "production";
var path = require('path');
var webpack = require('webpack');

module.exports = 
{
	context: __dirname,
	devtool: debug ? "inline-sourcemap" : null,
	entry: 
	{
		clientMainPage: "./src/MainPage/client.js",
		clientLoginPage: "./src/LoginPage/client.js"
	},
	output:
	{
		path: path.join(__dirname, "/public/javascripts"),
		filename: "[name].entry.js"
	},
	plugins: debug ? [] : 
	[
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
		new webpack.optimize.OccurrenceOrderPlugin()
	],
	module: 
	{	
		loaders: 
		[
			{ 
				test: /\.scss$/,
				loaders: ["style", "css", "sass"] 
			},
			{
				test: /\.js?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel-loader',
				query:
				{
					presets: ['react', 'es2015', 'stage-0'],
					plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties'],
				}
			},
			{
				test: /\.json$/,
				loader: "json-loader"
			}
		]
	},
	sassLoader: 
	{
	    includePaths: 
	    [
	    	path.resolve(__dirname, "./src/")
	    ]
  }
};