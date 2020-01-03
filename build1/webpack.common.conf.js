'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
const isDev = (process.env.NODE_ENV == 'development');
module.exports = {
    // mode: 'development', //编译模式
    // mode: 'production',
    //https://www.cnblogs.com/94pm/p/9619609.html
    // devtool: '#source-map',
    entry: {
        index: path.resolve(__dirname, '../src/index.js'), //入口文件
        vendors: ['jquery']
    },
    output: {
        publicPath: "./",
        path: path.resolve(__dirname, '../dist/'),
        filename: "js/[name]-[hash:8].bundle.js",
        chunkFilename: "js/[name]-[hash:8].chunk.js"
    },
    module: {
        // noParse:/jquery/,
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                loader: 'happypack/loader?id=happyBabel' //js编译 依赖.babelrc
            },
            {
                test: /\.s?[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] //postcss-loader 依赖 postcss-config.js
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use: [{
                    loader: "url-loader",
                    options: {
                        publicPath:"/",
                        name: '[name]_[hash].[ext]',
                        limit: 1024 * 5, // size <= 5KB
                        outputPath: 'images/',
                    }
                }, {
                    loader: 'img-loader',
                    options: {
                        plugins: [
                            require('imagemin-gifsicle')({
                                interlaced: false
                            }),
                            require('imagemin-mozjpeg')({
                                progressive: true,
                                arithmetic: false
                            }),
                            require('imagemin-pngquant')({

                                floyd: 0.5,
                                speed: 2
                            }),
                            require('imagemin-svgo')({
                                plugins: [{
                                        removeTitle: true
                                    },
                                    {
                                        convertPathData: false
                                    }
                                ]
                            })
                        ]
                    }
                }]
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            },
            { //在HTML中使用图片
                test: /\.(html|html)$/,
                use: 'html-withimg-loader',
                include: path.join(__dirname, '../'),
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        //多线程加快打包速度
        new HappyPack({
            id: "happyBabel",
            loaders: ['babel-loader?cacheDirectory=true'],
            verbose: false, // Write logs to console.
            threadPool: happyThreadPool
        }),
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, "./"),
            verbose: false, // Write logs to console.
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, '../index.html'),
            chunks: ['index', 'vendors', 'manifest'],
            minify: { //压缩配置
                removeComments: true, //删除html中的注释代码
                collapseWhitespace: true, //删除html中的空白符
                //removeAttributeQuotes: true //删除html元素中属性的引号
            },
            // chunksSortMode: 'dependency' //按dependency的顺序引入
        }),
        new MiniCssExtractPlugin({ //提取为外部css代码
            filename: isDev ? '[name].css' : 'style/[name].[hash].css',
            chunkFilename: isDev ? "[name].css" : "style/[name].[hash].css"
        }),
        // 自动加载模块，而不必到处 import 或 require 。
        // new webpack.ProvidePlugin({
        //     "$": "jquery",
        //     "jQuery": "jquery",
        //     "window.jQuery": "jquery"
        // }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        })
    ]
};