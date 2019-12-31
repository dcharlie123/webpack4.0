'use strict';

const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const HappyPack = require('happypack');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});
const BundleAnalyzerPlugin=require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
module.exports = {
    // mode: 'development', //编译模式
    mode: 'production',
    //https://www.cnblogs.com/94pm/p/9619609.html
    // devtool: '#source-map',
    devtool: 'cheap-module-source-map',
    entry: {
        index: './src/index.js', //入口文件
        vendors: ['jquery']
    },
    output: {
        publicPath: "./",
        path: path.resolve(__dirname, './dist'),
        filename: "js/[name]-[hash:5].bundle.js",
        chunkFilename: "js/[name]-[hash:5].chunk.js"
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'], //import引入时，无需写扩展名的文件
        // alias: {
        //     'vue$': 'vue/dist/vue.esm.js' //完整版本的vue
        // }
        alias: { // 创建import或require的别名
            '$': 'jquery',
            '@': path.resolve(__dirname, '../src')
        }
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
                        name: "[name]-[hash:5].min.[ext]",
                        limit: 1024 * 5, // size <= 5KB
                        outputPath: "img/"
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
        //拷贝静态资源
        new CopyWebpackPlugin([{
            from: 'static',
            to: './js'
        }]),
        //多线程加快打包速度
        new HappyPack({
            id: "happyBabel",
            loaders: ['cache-loader','babel-loader?cacheDirectory=true'],
            verbose: false, // Write logs to console.
            threadPool: happyThreadPool
        }),
        new CleanWebpackPlugin({
            root: path.resolve(__dirname, "./"),
            verbose: false, // Write logs to console.
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: path.resolve(__dirname, './index.html'),
            chunks: ['index', 'vendors', 'manifest'],
            minify: { //压缩配置
                removeComments: true, //删除html中的注释代码
                collapseWhitespace: true, //删除html中的空白符
                //removeAttributeQuotes: true //删除html元素中属性的引号
            },
            // chunksSortMode: 'dependency' //按dependency的顺序引入
        }),

        new MiniCssExtractPlugin({ //提取为外部css代码
            filename: 'style/[name].css?v=[contenthash]',
            chunkFilename: "[id].css"
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
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./vendor-manifest.json')
        }),
        new BundleAnalyzerPlugin({
            analyzerHost:'127.0.0.1',
            analyzerPort:8889
        })
    ],
    devServer: {
        hot: true,
        port: 3000, //端口号
        inline: true, //热更新类型
        proxy: {
            "/index.php": {
                target: "http://h5.oeeee.com/index.php",
                changeOrigin: true,
                secure: false
            }
        }
    },
    optimization: {
        minimizer: [
            // new UglifyJsPlugin({ //压缩js
            //     cache: true,
            //     parallel: true,
            //     sourceMap: true
            // }),
            new ParallelUglifyPlugin({
                cacheDir: ".cache/",
                uglifyJS: {
                    output: {
                        comments: false,
                        beautify: false
                    },
                    compress: {
                        drop_console: true,
                        collapse_vars: true,
                        reduce_vars: true
                    }
                }
            }),
            //压缩css
            new OptimizeCssAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                libs: {
                    name: "chunk-libs",
                    test: /[\\/]node_modules[\\/]/,
                    priority: 10,
                    chunks: "initial" // 只打包初始时依赖的第三方
                }
            }
        }
    }
    // optimization: {
    //     minimizer:[
    //         new UglifyJsPlugin({//压缩js
    //           cache:true,
    //           parallel:true,
    //           sourceMap:true
    //       }),
    //       new OptimizeCssAssetsPlugin({})
    //       ],
    //     splitChunks: {
    //         chunks: 'all', // 表示显示块的范围，有三个可选值：initial(初始块)、async(按需加载块)、all(全部块)，默认为all;
    //         minSize: 30000, //表示在压缩前的最小模块大小，默认为0；
    //         minChunks: 1, //表示被引用次数，默认为1；
    //         maxAsyncRequests: 5, //最大的按需(异步)加载次数，默认为1；
    //         maxInitialRequests: 3, //最大的初始化加载次数，默认为1；
    //         automaticNameDelimiter: '-',
    //         name: true, //拆分出来块的名字(Chunk Names)，默认由块名和hash值自动生成；
    //         cacheGroups: { //缓存组。
    //             vendors: {
    //                 test: /[\\/]node_modules[\\/]/,
    //                 name: "vendors",
    //                 chunks: "all"
    //             },
    //             commons: {
    //                 name: "commons",
    //                 chunks: "initial",
    //                 minChunks: 2
    //             }
    //         }
    //     },
    //     runtimeChunk: {
    //         name: 'manifest'
    //     },
    // }
};
if (process.env.NODE_ENV == 'development') {
    console.log('这是开发环境');
} else {
    console.log('这是生产环境');
}