- 设置环境为了兼容window系统，安装cross-env，然后在*package.json*加`cross-env NODE_ENV=production`或`cross-env NODE_ENV=development`
- webpack4 mode为production,自动开启
所有的优化代码
更小的bundle大小
去除掉只在开发阶段运行的代码
Scope hoisting和Tree-shaking
自动启用uglifyjs对代码进行压缩等,tree-shaking开启要设置 *babelrc* 文件
```
{
    modules: false
}
```
- webpack4对ExtractTextWebpackPlugin调整，建议选用新的CSS文件提取插件mini-css-extract-plugin
- [webpack SplitChunksPlugin实用指南](https://juejin.im/post/5b99b9cd6fb9a05cff32007a)
