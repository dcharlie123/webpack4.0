const path = require('path')
const webpack = require('webpack')
const pkg = require('../package.json')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

function filterTypes() {
    var tpsReg = /^@types/i
    return Object.keys(pkg.dependencies).filter((item) => {
        return !tpsReg.test(item)
    })
}
module.exports = {
    context: path.resolve(__dirname, '../'),
    // 你想要打包的模块的数组
    entry: {
        vendor: ['jquery']
    },
    output: {
        path: resolve('dist'), // 打包后文件输出的位置
        filename: '[name].dll.js',
        library: '[name]_library'
        // 这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    plugins: [
        new webpack.DllPlugin({
            path: resolve('dist/manifest.json'),
            name: '[name]_library',
            context: path.resolve(__dirname, '../')
        })
    ]
};