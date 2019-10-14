/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module RootRouter
 * @description 路由
 * @copyright minjie<15181482629@163.com>
 */

import * as React from 'react'
import { HashRouter as Router, Switch } from 'react-router-dom'
import { RouterMoudel, SilderInterface } from '@components/index'
import router from './moudle'
import { SysUtil } from '@utils/index'

export default class RootRouter extends React.Component {
  /** 自定义离开的提示信息 */
  getUserConfirmation = (message: string, callback: Function) => {
    let flag = true
    callback(flag)
  }

  onSilderData = (silderAry:Array<SilderInterface>) => {
    SysUtil.setSessionStorage('silderAry', silderAry)
  }

  render () {
    return (
      <Router hashType="noslash" getUserConfirmation={this.getUserConfirmation}>
        <Switch>
          <RouterMoudel onSilderData={this.onSilderData} {...this.props} routes={router} />
        </Switch>
      </Router>
    )
  }
}
