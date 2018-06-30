const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        index: ['./js/index.js'],
        'index-sp': ['./js/index-sp.js'],
    },
    output: {
        path: path.resolve('dest'),
        filename: '[name].js',
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: './index.css' },
            { from: './index-sp.css' },
            { from: './assets', to: 'assets' },
        ]),
    ],
};
