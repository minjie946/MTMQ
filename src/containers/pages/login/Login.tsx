/**
 * @author minjie
 * @createTime 2019/05/23
 * @description 登录界面
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Redirect, Link } from 'react-router-dom'

import './login.styl'

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
        <Link to="/home" replace>home</Link>
      </div>
    )
  }
}
