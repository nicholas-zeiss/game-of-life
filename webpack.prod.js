

const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
const rxPaths = require('rxjs/_esm5/path-mapping');
const webpack = require('webpack');


module.exports = {
	mode: 'production',
	entry: './app/client/Main.js',
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist')
	},
	resolve: {
		alias: rxPaths()
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, 'app/client')
				],
				exclude: [
					path.resolve(__dirname, 'node_modules')
				],
				loader: 'babel-loader',
				options: {
					plugins: [
						'@babel/plugin-proposal-class-properties',
						'@babel/plugin-proposal-object-rest-spread',
						'react-hot-loader/babel'
					],
					presets: [
						'@babel/preset-env',
						'@babel/preset-react'
					]
				}
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							modules: true,
							sourceMap: false
						}
					}
				]
			}
		]
	},
	optimization: {
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/](react|react-dom|rxjs)[\\/]/,
					name: 'vendors',
					chunks: 'all'
				}
			}
		}
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new HtmlWebPackPlugin({
			template: 'app/index.html'
		}),
		new webpack.HashedModuleIdsPlugin()
	]
};

