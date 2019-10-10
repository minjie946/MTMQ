/**
 * @author minjie
 * @createTime 2019/05/23
 * @description 登录界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'

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
        sss
      </div>
    )
  }
}
