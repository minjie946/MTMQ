/**
 * @author minjie
 * @createTime 2019/05/14
 * @description  webpack 测试环境的配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'
process.env.NODE_ENV = 'development'
process.env.BABEL_ENV = 'dev'

const config = require('./webpack.config.js')
const common = require('./webpack.common.js')
const merge = require('webpack-merge')
const webpack = require('webpack')

module.exports = merge(common(process.env.NODE_ENV), {
  mode: process.env.NODE_ENV,
  entry: {
    main: [
      'webpack-hot-middleware/client',
      'react-hot-loader/patch',
      config.entry
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})
