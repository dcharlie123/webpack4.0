const webpack = require('webpack');
const webpackConfig = require('./webpack.common.conf.js');
const WebpackMerge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const path=require('path');
module.exports = WebpackMerge(webpackConfig, {
    mode: "production",
    devtool: 'cheap-module-source-map',
    plugins: [
        //拷贝静态资源
        new CopyWebpackPlugin([{
            from:path.resolve(__dirname,'../static'),
            to:path.resolve(__dirname,'../dist/static')
          }]),
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            // 只处理大于xx字节 的文件，默认：0
            threshold: 10240,
            // 示例：一个1024b大小的文件，压缩后大小为768b，minRatio : 0.75
            minRatio: 0.8, // 默认: 0.8
            // 是否删除源文件，默认: false
            deleteOriginalAssets: false
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('../vendor-manifest.json')
        }),
        new BundleAnalyzerPlugin({
            analyzerHost: '127.0.0.1',
            analyzerPort: 8889
        })
    ],
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
})