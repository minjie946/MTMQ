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
