/**
 * @author minjie
 * @createTime 2019/05/23
 * @description 登录界面
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { RootComponent, RouterMoudelProps, RouterMoudel } from '@components/index'
import { Link } from 'react-router-dom'

interface LoginProps extends RouterMoudelProps {
}

interface LoginState {
}

export default class Login extends RootComponent<LoginProps, LoginState> {
  constructor (props:any) {
    super(props)
    this.state = {}
  }

  render () {
    const { routes } = this.props
    return (
      <div className="login-content" >
        <Link to="/home/one">one</Link>
        <br/>
        <Link to="/home/two">two</Link>
        <RouterMoudel {...this.props} routes={routes}/>
      </div>
    )
  }
}
