/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 路由管理
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { HashRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import Routes from './moudle/index' // 获取所有的路由数据
import Loadable from './loadable'

import CustomRouter from './CustomeRouter'

const Login = Loadable(() => import(/* webpackChunkName: "login" */'@pages/login/Login'))
// 另外的作用：合同的
const Other = Loadable(() => import(/* webpackChunkName: "other" */ '@pages/other'))

export default class Root extends RootComponent {
  constructor (props:any) {
    super(props)
  }

  /** 自定义离开的提示信息 */
  getUserConfirmation = (message: string, callback: Function) => {
    let flag = true
    callback(flag)
  }

  render () {
    return (
      <div style={{ height: '100%' }}>
        <Router hashType="noslash" getUserConfirmation={this.getUserConfirmation}>
          <Switch>
            <Route path="/other/contract/haha" exact component={Other} />
            <Route path="/login" exact component={Login} />
            <Redirect from="/" exact to='/login'/>
            <CustomRouter {...this.props} config={Routes}/>
          </Switch>
        </Router>
      </div>
    )
  }
}
