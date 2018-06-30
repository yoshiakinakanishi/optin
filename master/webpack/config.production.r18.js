const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const base = require('./config.base.js');
const r18 = require('./config.base.r18.js');

module.exports = merge(base, r18, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ENV': JSON.stringify('production'),
            'process.env.TAID_common': JSON.stringify('TA0000015f3952203463c5014a'),
            'process.env.TAID_campaign': JSON.stringify('TA000001608d300b1b668d00d4'),
            'process.env.TAID_service': JSON.stringify('TA000001608d2805480cb200eb'),            
            'process.env.TRANSITION_URL': JSON.stringify('https://www.dmm.co.jp/my/-/login/=/path=DRVESRUMTh1VHEFZVFNIUwwIGFVfFw5JTRJCFVpK'),
        }),
        new CopyWebpackPlugin([
            { from: './manifest/manifest-prd-r18.json', to: 'manifest.json' },
            { from: './jsplugin/production/pushlib-bundle.js' },
            { from: './jsplugin/production/pushlib-sw.js' },
        ]),
        new InterpolateHtmlPlugin({
            transition_url:
                'https://www.dmm.co.jp/my/-/login/=/path=DRVESRUMTh1VHEFZVFNIUwwIGFVfFw5JTRJCFVpK',
            guide_url:
                'http://www.dmm.co.jp/service/-/exchange/=/url=DRVESRUMTh1VHEFZVFNIUwwIGFVfVEtJFxFfSQ__',
            top_url:
                'https://www.dmm.co.jp/my/-/top/',
        }),
    ],
});
