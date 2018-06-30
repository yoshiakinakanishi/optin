const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            'process.env.R18_FLAG': 1,
            'process.env.PC_NAVI_HEADER_URL': JSON.stringify('https://www.dmm.co.jp/remotepage/-/navi/=/channel=default/link=_parent/hide_login=0/loginoutpath=aHR0cHM6Ly93d3cuZG1tLmNvLmpwLw==/subfooter=off/page=footer/page=header/adult_link=1/_jloff=1/curl=1/search_box=0/logo_only=0/'),
            'process.env.PC_NAVI_FOOTER_URL': JSON.stringify('https://www.dmm.co.jp/remotepage/-/navi/=/channel=default/link=_parent/loginoutpath=aHR0cHM6Ly93d3cuZG1tLmNvLmpwLw==/page=footer/adult_link=0/_jloff=1/curl=1/search_box=0/'),
            'process.env.SP_NAVI_URL': JSON.stringify('https://www.dmm.co.jp/misc/-/navi/smartphone/' +
                    '?path=' +
                    'aHR0cHM6Ly93d3cuZG1tLmNvLmpwLw==' +
                    '&logo_only=0' +
                    '&parts=head,header,footer'),
        }),
        new HtmlWebpackPlugin({
            inject: false,
            filename: 'index.html',
            template: './index-r18.html',
        }),
        new HtmlWebpackPlugin({
            inject: false,
            filename: 'index-sp.html',
            template: './index-sp-r18.html',
        }),
    ],
};
