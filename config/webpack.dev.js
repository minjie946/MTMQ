/**
 * 配置文件，基础的配置
 * @authors minjie
 * @date    2019/09/29
 * @version 1.0.0 firstVersion
 * @module dev
 * @description webpack 开发环境的配置
 * @copyright minjie<15181482629@163.com>
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
