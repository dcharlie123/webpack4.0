'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
module.exports = {
    mode: 'production', //编译模式
    entry: {
        index: './src/js/index.js', //入口文件
        vendors: ['jquery']
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'], //import引入时，无需写扩展名的文件
        // alias: {
        //     'vue$': 'vue/dist/vue.esm.js' //完整版本的vue
        // }
        alias: { // 创建import或require的别名
            '$': 'jquery'
        }
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader' //js编译 依赖.babelrc
            },
            {
                test: /\.s?[ac]ss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'] //postcss-loader 依赖 postcss-config.js
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader'
            }
        ]
    },
    watch: true,
    watchOptions: { //不监听目录
        ignored: [/node_modules/, '/static/']
    },
    output: {
        filename: 'js/[name].js?v=[hash]',
        path: path.resolve(__dirname, './static/dist'),
        // publicPath:'/dist/'
    },
    // devtool: '#source-map',
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, './static')]),
        //启用js压缩
        // new UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './src/index.html'),
            chunks: ['index', 'vendors', 'manifest']
            // minify: { //压缩配置
            //     removeComments: true, //删除html中的注释代码
            //     collapseWhitespace: true, //删除html中的空白符
            //     removeAttributeQuotes: true //删除html元素中属性的引号
            // },
            // chunksSortMode: 'dependency' //按dependency的顺序引入
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new MiniCssExtractPlugin({ //提取为外部css代码
            filename: 'style/[name].css?v=[contenthash]'
        }),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery"
        }),
        // new webpack.NamedModulesPlugin(), 
        // new webpack.HotModuleReplacementPlugin(),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': JSON.stringify('production')
        // }),
    ],
    devServer: {
        // hot: true,
        port: 3000, //端口号
        inline: true, //热更新类型
        // proxy: { ...
        // }
        proxy:{
            "/index.php":{
                target:"http://h5.oeeee.com/index.php",
                changeOrigin:true,
                secure:false
            }
        }
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
        ],
        splitChunks: {
            chunks: 'all', // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
            minSize: 30000, //表示在压缩前的最小模块大小，默认为0；
            minChunks: 1, //表示被引用次数，默认为1；
            maxAsyncRequests: 5, //最大的按需(异步)加载次数，默认为1；
            maxInitialRequests: 3, //最大的初始化加载次数，默认为1；
            automaticNameDelimiter: '-',
            name: true, //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
            cacheGroups: { //缓存组。
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                },
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2
                }
            }
        },
        runtimeChunk: {
            name: 'manifest'
        },
    }
};