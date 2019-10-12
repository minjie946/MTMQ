/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module root
 * @description 版本的显示
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { ConfigUtil } from '@utils/index'
import './index.styl'

const Version = (color: 'cus-version-color' | 'cus-version-color-b' | 'cus-version-color-black') => {
  let build = `${ConfigUtil.watermark} version: ${process.env.version}  build:${process.env.build}`
  return (
    <div className={`cus-version-content ${color}`}>{build}</div>
  )
}

export default Version
