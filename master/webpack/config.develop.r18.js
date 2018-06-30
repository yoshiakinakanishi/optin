const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const base = require('./config.base.js');
const r18 = require('./config.base.r18.js');

module.exports = merge(base, r18, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ENV': JSON.stringify('develop'),
            'process.env.TAID': JSON.stringify('TA0000015b46cdeb070c120002'),
        }),
        new CopyWebpackPlugin([
            { from: './manifest/manifest-dev-r18.json', to: 'manifest.json' },
            { from: './jsplugin/development/pushlib-bundle.js' },
            { from: './jsplugin/development/pushlib-sw.js' },
        ]),
        new InterpolateHtmlPlugin({
            transition_url:
                'https://www.dmm.co.jp/my/-/login/=/path=DRVESRUMTh1cAEcVXk8WVgYAGFJdVEpaDUxdFh0VQkMNTg__',
            guide_url:
                'http://www.dmm.co.jp/service/-/exchange/=/url=DRVESRUMTh1cAEcVXk8WVgYAGFJdVEpaDQ8YFkcWXx8_',
            top_url:
                'https://www.dmm.co.jp/my/-/top/',
        }),
    ],
});
