/**
 * @author minjie
 * @createTime   2019/05/14
 * @description  webpack 正式环境的配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'
process.env.NODE_ENV = 'production'
process.env.BABEL_ENV = 'prod'
const utils = require('./utils/index')
const common = require('./webpack.common.js')
const config = require('./webpack.config.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = merge(common(process.env.NODE_ENV), {
  entry: {
    main: [ config.entry ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CompressionWebpackPlugin(),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    }),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([{
      from: utils.resolveApp('statics'),
      to: utils.resolveApp('dist/statics')
    }]),
    new webpack.DllReferencePlugin({
      manifest: require(utils.join('config/dll/', 'vendor.manifest.json'))
    }),
    new AddAssetHtmlPlugin({
      filepath: require.resolve('./dll/vendor.js'),
      includeSourcemap: false,
      hash: true
    })
    // new BundleAnalyzerPlugin({ analyzerPort: 8919 })
  ],
  optimization: {
    splitChunks: {
      name: 'common',
      chunks: 'all',
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      minSize: 30000,
      cacheGroups: {
        vendor: { // 抽离第三方插件
          test: /[\\/]node_modules[\\/]/, // 指定是node_modules下的第三方包
          chunks: 'initial',
          minSize: 0, // 大于0个字节
          filename: 'js/common.bundle.[chunkhash:8].js',
          priority: 10,
          minChunks: 2 // 在分割之前，这个代码块最小应该被引用的次数
        },
        common: {
          chunks: 'initial',
          minSize: 0, // 大于0个字节
          minChunks: 2 // 抽离公共代码时，这个代码块最小被引用的次数
        }
      }
    },
    runtimeChunk: {
      name: 'mainifels'
    },
    minimizer: [
      new UglifyJSPlugin({
        exclude: /\.min\.js$/, // 过滤掉以".min.js"结尾的文件，我们认为这个后缀本身就是已经压缩好的代码，没必要进行二次压缩
        parallel: true, // 开启并行压缩，充分利用cpu
        sourceMap: false,
        extractComments: 'all' // 移除注释
      }),
      new OptimizeCssAssetsPlugin()
    ]
  },
  performance: {
    hints: false,
    maxAssetSize: 4000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 5000000 // 整数类型（以字节为单位）
  }
})
