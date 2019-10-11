/**
 * @authors minjie
 * @date    2019/09/29
 * @version 1.0.0 firstVersion
 * @module dev-run
 * @description nodeJs 运行开发环境
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'
const express = require('express')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const childProcess = require('child_process')
const common = require('./webpack.dev')
const config = require('./webpack.config.js')
const utils = require('./utils/index')
const app = express()

const compiler = webpack(common)

app.use(webpackHotMiddleware(compiler, {
  log: false,
  heartbeat: 2000,
  noInfo: true,
  reload: true,
  name: 'renderer'
}))

const instance = webpackDevMiddleware(compiler, {
  publicPath: '/'
})

app.use(instance)

instance.waitUntilValid(() => {
  utils.log(' 启动成功！success!!!! ', 'green')
  let cmd
  if (process.platform === 'wind32') {
    cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"'
  } else if (process.platform === 'linux') {
    cmd = 'xdg-open'
  } else if (process.platform === 'darwin') {
    cmd = 'open'
  }
  childProcess.exec(`${cmd} http://${config.devServer}:${config.devProt}`)
})

app.listen(config.devProt, config.devServer, function () {
  console.log(`http://${config.devServer}:${config.devProt}`)
})
