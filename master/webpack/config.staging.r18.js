const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const base = require('./config.base.js');
const r18 = require('./config.base.r18.js');

module.exports = merge(base, r18, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ENV': JSON.stringify('staging'),
            'process.env.TAID_common': JSON.stringify('TA0000015f3942d219763f05cc'),
            'process.env.TAID_campaign': JSON.stringify('TA000001608c7073d0763f0a9c'),
            'process.env.TAID_service': JSON.stringify('TA000001608c687c90763f0a98'),            
        }),
        new CopyWebpackPlugin([
            { from: './manifest/manifest-stg-r18.json', to: 'manifest.json' },
            { from: './jsplugin/staging/pushlib-bundle.js' },
            { from: './jsplugin/staging/pushlib-sw.js' },
        ]),
        new InterpolateHtmlPlugin({
            transition_url:
                'https://www.dmm.co.jp/my/-/login/=/path=DRVESRUMTh1LEVYVXk8WVgYAGFJdVEpaDUxdFh0VQkMNTg__',
            guide_url:
                'http://www.dmm.co.jp/service/-/exchange/=/url=DRVESRUMTh1LEVYVXk8WVgYAGFJdVEpaDQ8YFkcWXx8_',
            top_url:
                'https://www.dmm.co.jp/my/-/top/',
        }),
    ],
});
