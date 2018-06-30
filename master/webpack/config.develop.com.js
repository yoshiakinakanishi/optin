const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const base = require('./config.base.js');
const com = require('./config.base.com.js');

module.exports = merge(base, com, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ENV': JSON.stringify('develop'),
            'process.env.TAID': JSON.stringify('TA0000015b46cdeb070c120002'),
        }),
        new CopyWebpackPlugin([
            { from: './manifest/manifest-dev-com.json', to: 'manifest.json' },
            { from: './jsplugin/development/pushlib-bundle.js' },
            { from: './jsplugin/development/pushlib-sw.js' },
        ]),
        new InterpolateHtmlPlugin({
            transition_url:
                'https://www.dmm.com/my/-/login/=/path=DRVESRUMTh1cAEcVXk8WVgYAGFJdVEpaDQ8YFkcWXx8_',
            guide_url:
                'http://www.dmm.com/service/-/exchange/=/url=DRVESRUMTh1cAEcVXk8WVgYAGFJdVEpaDUxdFh0VQkMNTg__',
            top_url:
                'https://www.dmm.com/my/-/top/',
        }),
    ],
});
