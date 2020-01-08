const path = require("path");
const webpackCommon = require('./webpack.common.conf.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin') // 清空打包目录的插件
module.exports = webpackMerge(webpackCommon, {
    mode: "production",
    output: {
        publicPath: '/' //这里要放的是静态资源CDN的地址(一般只在生产环境下配置)
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['*/*', '!manifest.json', '!vendor.dll.js'],
            // verbose: true,
        }),
        new OptimizeCSSAssetsPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),
        new webpack.DllReferencePlugin({
            manifest: path.resolve(__dirname, '..', 'dist', 'manifest.json')
        }),
        new AddAssetHtmlPlugin({
            filepath: path.resolve(__dirname, '../dist/*.dll.js'),
        })
    ],
    // optimization: {
    //     // 分割代码块
    //     splitChunks: {
    //         // 缓存分组
    //         cacheGroups: {
    //             // 第三方模块
    //             vendor: {
    //                 priority: 1, // 权限更高，优先抽离，重要！！！
    //                 test: /node_modules/,
    //                 chunks: 'initial',
    //                 minSize: 0, // 大小限制
    //                 minChunks: 1 // 最少复用过几次
    //             },

    //             // 公共的模块
    //             common: {
    //                 chunks: 'initial',
    //                 minSize: 0, // 公共模块的大小限制
    //                 minChunks: 2 // 公共模块最少复用过几次
    //             }
    //         }
    //     }
    // },
})