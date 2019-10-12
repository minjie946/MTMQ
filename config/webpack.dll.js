/**
 * 配置文件，基础的配置
 * @authors minjie
 * @date    2019/09/29
 * @version 1.0.0 firstVersion
 * @module dll
 * @description webpack 提前打包的配置
 * @copyright minjie<15181482629@163.com>
 */
'use strict'
process.env.NODE_ENV = 'production'

const utils = require('./utils/index')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
  target: 'web',
  mode: process.env.NODE_ENV,
  entry: {
    vendor: [
      'ali-oss', 'antd', 'axios', 'react-sortable-hoc',
      'crypto-js', 'js-md5', 'mobx',
      'mobx-react', 'moment', 'react',
      'react-dom', 'react-loadable', 'react-router-dom'
    ]
  },
  output: {
    path: utils.resolveApp('config/dll'),
    publicPath: './',
    filename: '[name].js',
    library: '[name]_library_wcr'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      path: utils.join('config/dll', '[name].manifest.json'),
      name: '[name]_library_wcr'
    })
  ]
}
