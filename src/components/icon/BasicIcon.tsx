/**
 * @author minjie
 * @createTime 2019/05/16
 * @description icon
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'

import error from '@assets/images/state/error.png' // table 错误
import info from '@assets/images/state/info.png' // table 正常
import success from '@assets/images/state/success.png' // table 成功

import fill from '@assets/images/icon/Fill.png' // 时间的选择icon
import add from '@assets/images/icon/add.png' // add 加号

import userBank from '@assets/images/user/bank.png' // 个人信息 银行
import userGroup from '@assets/images/user/group.png' // 个人及工作信息
import userInfo from '@assets/images/user/info.png' // 补充信息
import userShezhi from '@assets/images/user/shezhi.png' // 系统

import './BasicIcon.less'

let iconTemplte = (icon: any, width?: any, height?: any, lineHeight?: any, className?: string) => {
  let obj = {
    style: {
      display: 'inline-block',
      verticalAlign: 'middle',
      width: width + 'px' || '10px',
      height: height + 'px' || '10px',
      lineHeight: lineHeight + 'px' || '10px'
    },
    className: className
  }
  return <span><img src={icon} {...obj}></img></span>
}

export const Success = () => iconTemplte(success, 8, 8, 16, 'icon-16') // table 成功
export const Info = () => iconTemplte(info, 8, 8, 16, 'icon-16') // table 正常
export const Errors = () => iconTemplte(error, 8, 8, 16, 'icon-16') // table 错误
export const Fill = () => iconTemplte(fill, 14, 16) // 时间buffix
export const Add = () => iconTemplte(add, 30, 31) // 新增的

export const userBankPNG = userBank // 个人信息 银行
export const userGroupPNG = userGroup // 个人及工作信息
export const userInfoPNG = userInfo // 补充信息
export const userShezhiPNG = userShezhi // 系统信息
