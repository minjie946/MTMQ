/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module root
 * @description 版本的显示
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
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
