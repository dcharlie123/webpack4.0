const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",

  plugins: [
    new ExtractTextPlugin({
      filename: "[name].[chunkhash:8].css",
      allChunks: false // 只包括初始化css, 不包括异步加载的CSS
    }),
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "../"),
      verbose: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: {
            removeAll: true
          }
        }],
      },
    })
  ],
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