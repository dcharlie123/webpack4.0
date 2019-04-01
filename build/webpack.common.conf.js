const webpack = require("webpack");
const merge = require("webpack-merge");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const PostCss_Sprites = require('postcss-sprites');
const productionConfig = require("./webpack.prod.conf.js"); // 引入生产环境配置文件
const developmentConfig = require("./webpack.dev.conf.js"); // 引入开发环境配置文件

/**
 * 根据不同的环境，生成不同的配置
 * @param {String} env "development" or "production"
 */
// let spritesConfig = {
//     spritePath: "./dist/static"
//   };
const generateConfig = env => {

    let scriptLoader = [{
        loader: "babel-loader"
    }];
    let cssLoader = [{
        loader: "css-loader",
        options: {
            // minimize: true,
            sourceMap: env === "development" ? true : false // 开发环境：开启source-map
        }
    }, {
        loader: "postcss-loader"
    }, {
        loader: "sass-loader"
    }];
    let styleLoader =
        env === "production" ?
        ExtractTextPlugin.extract({
            // 生产环境：分离、提炼样式文件
            fallback: {
                loader: "style-loader"
            },
            use: cssLoader
        }) : // 开发环境：页内样式嵌入
        ['style-loader', ...cssLoader];
    return {
        entry: {
            app: "./src/index.js",
            vendors: ['jquery']
        },
        output: {
            publicPath: env === "development" ? "/" : "./",
            path: path.resolve(__dirname, '../dist'),
            filename: "[name]-[hash:5].bundle.js",
            chunkFilename: "[name]-[hash:5].chunk.js"
        },
        module: {
            rules: [{
                    test: /\.js$/,
                    exclude: /(node_modules)/,
                    use: scriptLoader
                },
                {
                    test: /\.s?[ac]ss$/,
                    use: styleLoader
                }, {
                    test: /\.(eot|woff2?|ttf|svg)$/,
                    use: [{
                        loader: "url-loader",
                        options: {
                            name: "[name]-[hash:5].min.[ext]",
                            limit: 5000, // fonts file size <= 5KB, use 'base64'; else, output svg file
                            publicPath: "fonts/",
                            outputPath: "fonts/"
                        }
                    }]
                }, {
                    test: /\.(png|jpg|jpeg|gif)$/,
                    use: [{
                        loader: "url-loader",
                        options: {
                            name: "[name]-[hash:5].min.[ext]",
                            limit: 8 * 1024, // size <= 20KB
                            publicPath: "static/",
                            outputPath: "static/"
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
                { //在HTML中使用图片
                    test: /\.(html|html)$/,
                    use: 'html-withimg-loader',
                    include: path.join(__dirname, '../'),
                    exclude: /node_modules/
                }

            ]
        },
        plugins: [
            // 开发环境和生产环境二者均需要的插件
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: path.resolve(__dirname, "..", "index.html"),
                chunks: ["app", 'vendors', 'manifest'],
                minify: {
                    collapseWhitespace: true,
                    removeComments: true
                }
            }),
            new webpack.ProvidePlugin({
                $: "jquery"
            })
        ]
    }
}
module.exports = env => {
    let config = env === "production" ? productionConfig : developmentConfig;
    return merge(generateConfig(env), config);
};