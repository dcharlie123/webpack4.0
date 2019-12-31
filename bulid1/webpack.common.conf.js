const path = require("path");
module.exports = {
    entry: {
        main: "./src/index.js"
    },
    output: {
        publicPath: env === "development" ? "/" : "./",
        path: path.resolve(__dirname, '../dist'),
        filename: "[name]-[hash:5].bundle.js",
        chunkFilename: "[name]-[hash:5].chunk.js"
    },
    module:{
        rules:[]
    }
}