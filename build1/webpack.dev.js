const Webpack=require('webpack');
const webpackConfig=require('./webpack.common.conf.js');
const WebpackMerge=require('webpack-merge');
module.exports=WebpackMerge(webpackConfig,{
    mode:"development",
    devtool:'cheap-module-eval-source-map',
    devServer:{
        port:3000,
        hot:true,
        contentBase:"../dist",
        proxy: {
            "/index.php": {
                target: "http://h5.oeeee.com/index.php",
                changeOrigin: true,
                secure: false
            }
        }
    },
    plugins:[
        new Webpack.HotModuleReplacementPlugin()
    ]
})