const webpack = require('webpack');
const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');

const base = require('./config.base.js');
const com = require('./config.base.com.js');

module.exports = merge(base, com, {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.ENV': JSON.stringify('production'),
            'process.env.TAID_common': JSON.stringify('TA0000015f394d53c663c50147'),
            'process.env.TAID_campaign': JSON.stringify('TA000001608d32c6dc668d00d6'),
            'process.env.TAID_service': JSON.stringify('TA000001608d2cf5150cb200ed'),            
        }),
        new CopyWebpackPlugin([
            { from: './manifest/manifest-prd-com.json', to: 'manifest.json' },
            { from: './jsplugin/production/pushlib-bundle.js' },
            { from: './jsplugin/production/pushlib-sw.js' },
        ]),
        new InterpolateHtmlPlugin({
            transition_url:
                'https://www.dmm.com/my/-/login/=/path=DRVESRUMTh1VHEFZVFNIUwwIGFVfVEtJFxFfSQ__',
            guide_url:
                'http://www.dmm.com/service/-/exchange/=/url=DRVESRUMTh1VHEFZVFNIUwwIGFVfFw5JTRJCFVpK',
            top_url:
                'https://www.dmm.com/my/-/top/',
        }),
    ],
});
