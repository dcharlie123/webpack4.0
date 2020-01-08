const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

function assetsPath(_path_) {
    let assetsSubDirectory;
    if (process.env.NODE_ENV === 'production') {
        assetsSubDirectory = 'static' //可根据实际情况修改
    } else {
        assetsSubDirectory = 'static'
    }
    return path.posix.join(assetsSubDirectory, _path_)
}

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        index: "./src/index.js"
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js'
    },
    resolve: {
        extensions: [".js", ".css", ".json"],
        alias: {} //配置别名可以加快webpack查找模块的速度
    },
    module: {
        rules: [{
                test: /\.js$/,
                loader: 'happypack/loader?id=happyBabel',
                include: [resolve('src')],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
                include: [resolve('src')],
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
                include: [resolve('src')],
                exclude: /node_modules/,
            },
            { //file-loader 解决css等文件中引入图片路径的问题
                // url-loader 当图片较小的时候会把图片BASE64编码，大于limit参数的时候还是使用file-loader 进行拷贝
                test: /\.(png|jpg|jpeg|gif|svg)/,
                use: {
                    loader: 'url-loader',
                    options: {
                        name: assetsPath('images/[name].[hash:7].[ext]'), // 图片输出的路径
                        limit: 1 * 1024
                    }
                }
            },
            { //在HTML中使用图片
                test: /\.(html|html)$/,
                use: 'html-withimg-loader',
                include: path.join(__dirname, '../'),
                exclude: /node_modules/
            }
        ],
    },
    optimization: { //webpack4.x的最新优化配置项，用于提取公共代码

        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: "initial",
                    name: "common",
                    minChunks: 2,
                    maxInitialRequests: 5, // The default limit is too small to showcase the effect
                    minSize: 0, // This is example is too small to create commons chunks
                    reuseExistingChunk: true // 可设置是否重用该chunk（查看源码没有发现默认值）
                }
            }
        }
    },
    plugins: [
        //多线程加快打包速度
        new HappyPack({
            id: "happyBabel",
            loaders: ['cache-loader', 'babel-loader?cacheDirectory=true'],
            verbose: false, // Write logs to console.
            threadPool: happyThreadPool
        }),
        new htmlWebpackPlugin({
            template: 'src/index.html',
            filename: 'index.html',
            minify: { //压缩配置
                removeComments: true, //删除html中的注释代码
                collapseWhitespace: true, //删除html中的空白符
                removeAttributeQuotes: true //删除html元素中属性的引号
            }
        }),
        //自动加载模块，而不必到处 import 或 require 
        new webpack.ProvidePlugin({
            $: 'jquery'
        }),
        //环境变量
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        new MiniCssExtractPlugin({
            filename: "css/[name].[hash:8].css",
            chunkFilename: "css/[id].css"
        }),
    ]
}