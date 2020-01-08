const path = require("path");
const webpackCommon = require('./webpack.common.conf.js');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');


module.exports = webpackMerge(webpackCommon, {
    mode:"development",
    plugins:[
        new webpack.NamedModulesPlugin(),  //用于启动HMR时可以显示模块的相对路径
        new webpack.HotModuleReplacementPlugin(), // 开启模块热更新，热加载和模块热更新不同，热加载是整个页面刷新
    ],
    devServer: {
        inline: true, //打包后加入一个websocket客户端
        hot: true, //热加载
        contentBase: path.join(__dirname, "..", "dist"), //静态文件根目录
        port: 3000,
        host: '127.0.0.1',
        overlay: true,
        compress: false // 服务器返回浏览器的时候是否启动gzip压缩
    }
})