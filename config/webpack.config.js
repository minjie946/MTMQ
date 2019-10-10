/**
 * 配置文件，基础的配置
 * @authors minjie
 * @date    2019/09/29
 * @version 1.0.0 firstVersion
 * @module config
 * @description webpack 手动的配置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'
const utils = require('./utils/index')
const theme = require('./utils/theme.js')
const packages = require('../package.json')
const moment = require('moment')

module.exports = {
  entry: utils.resolveApp('src/index.tsx'),
  html: {
    title: '',
    template: utils.resolveApp('config/utils/index.ejs'),
    favicon: ''
  },
  definePlugin: {
    'process.env': {
      tag: JSON.stringify(process.env.tag),
      version: JSON.stringify(packages.version),
      build: JSON.stringify(moment(new Date()).format('YYYY.MM.DD HHmmss'))
    }
  },
  module: {
    lessOption: {
      modifyVars: theme,
      javascriptEnabled: true
    }
  },
  alias: {
    '@components': utils.resolveApp('src/components'),
    '@assets': utils.resolveApp('src/assets'),
    '@utils': utils.resolveApp('src/utils'),
    '@shared': utils.resolveApp('src/containers/shared'),
    '@pages': utils.resolveApp('src/containers/pages'),
    '@router': utils.resolveApp('src/router'),
    '@server': utils.resolveApp('src/server'),
    '@typings': utils.resolveApp('typings')
  },
  devServer: '127.0.0.1',
  devProt: 8686
}
