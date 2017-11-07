// 开发环境
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require("extract-text-webpack-plugin")
var SpritesmithPlugin = require('webpack-spritesmith')  // 雪碧图合并
var path = require('path');
var webpack = require('webpack');

// 引入基本配置
var config = require('./webpack.config.js');

config.output.publicPath = '/';

config.plugins = [
    new HtmlWebpackPlugin({
        filename: 'index.html',
        template: path.resolve(__dirname, '../index.html'),
        inject: true
    }),

    new webpack.ProvidePlugin({
        jQuery: "jquery",
        $: "jquery"
    }),

    // 生成独立CSS文件
    new ExtractTextPlugin("./css/[name].css"),

    new SpritesmithPlugin({
        // 目标小图标
        src: {
            cwd: path.resolve(__dirname, '../src/assets/images/icons'),
            glob: '*.png'
        },
        // 输出雪碧图文件及样式文件
        target: {
            image: path.resolve(__dirname, '../src/assets/images/sprite.png'),
            css: path.resolve(__dirname, '../src/assets/css/sprite.css')
        },
        // 样式文件中调用雪碧图地址写法
        apiOptions: {
            cssImageRef: '../images/sprite.png'
        },
        spritesmithOptions: {
            algorithm: 'top-down'
        }
    }),

    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
];

// 修改基本配置入口环境
var devClient = './config/dev-client.js';
Object.keys(config.entry).forEach(function (name, i) {
    var extras = [devClient]
    config.entry[name] = extras.concat(config.entry[name])
})

module.exports = config; 
