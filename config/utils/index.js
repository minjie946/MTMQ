'use strict'

const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { say } = require('cfonts')

const appDirectory = fs.realpathSync(process.cwd())
/**
 * 读取文件的位置信息
 * @param {*} relativePath 文件相对于工作目录下的地址
 */
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const join = (a, b) => path.join(appDirectory, a, b)

/** 启动的日志 */
function logStats (proc, data) {
  let log = ''
  log += chalk.yellow.bold(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join('-')}`)
  log += '\n\n'
  if (typeof data === 'object') {
    data.toString({ colors: true, chunks: false
    }).split(/\r?\n/).forEach(line => {
      log += '  ' + line + '\n'
    })
  } else {
    log += `  ${data}\n`
  }
  log += '\n' + chalk.yellow.bold(`┗ ${new Array(28 + 1).join('-')}`) + '\n'
  console.log(log)
}

/**
 * 初始的启动
 */
function greeting () {
  const cols = process.stdout.columns
  let text = ''
  if (cols > 104) text = 'React'
  else if (cols > 76) text = 'React'
  else text = false
  if (text) {
    say(text, {
      colors: ['yellow'],
      font: 'simple3d',
      space: false
    })
  } else console.log(chalk.yellow.bold('\n  electron-vue'))
  console.log(chalk.blue('  getting ready...') + '\n')
}

function log (msg, color) {
  console.log(chalk[color].bold(msg))
}

module.exports = {
  resolveApp,
  join,
  logStats,
  greeting,
  log
}
