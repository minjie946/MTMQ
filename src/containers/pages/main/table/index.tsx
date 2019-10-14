/**
 * @author minjie
 * @createTime 2019/05/23
 * @description 登录界面
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'

interface LoginProps {
}

interface LoginState {
}

export default class Login extends RootComponent<LoginProps, LoginState> {
  constructor (props:any) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div className="login-content" >
        <TableItem/>
      </div>
    )
  }
}
