const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const base = require('./config.base.js');
const com = require('./config.base.com.js');

module.exports = merge(base, com, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ENV': JSON.stringify('staging'),
            'process.env.TAID_common': JSON.stringify('TA0000015f39414273763f05c9'),
            'process.env.TAID_campaign': JSON.stringify('TA000001608c78604e763f0a9e'),
            'process.env.TAID_service': JSON.stringify('TA000001608c6e37c3763f0a9a'),        
        }),
        new CopyWebpackPlugin([
            { from: './manifest/manifest-stg-com.json', to: 'manifest.json' },
            { from: './jsplugin/staging/pushlib-bundle.js' },
            { from: './jsplugin/staging/pushlib-sw.js' },
        ]),
        new InterpolateHtmlPlugin({
            transition_url:
                'https://www.dmm.com/my/-/login/=/path=DRVESRUMTh1LEVYVXk8WVgYAGFJdVEpaDQ8YFkcWXx8_',
            guide_url:
                'http://www.dmm.com/service/-/exchange/=/url=DRVESRUMTh1LEVYVXk8WVgYAGFJdVEpaDUxdFh0VQkMNTg__',
            top_url:
                'https://www.dmm.com/my/-/top/',
        }),
    ],
});
