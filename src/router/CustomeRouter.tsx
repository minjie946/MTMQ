/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 自定义的路由 空值
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Route, withRouter, Redirect } from 'react-router-dom'
import { inject, observer } from 'mobx-react'
import { SysUtil, globalEnum, ConfigUtil } from '@utils/index'

import Routes from './moudle/index' // 获取所有的路由数据

interface CustomeRoutersState {
  route: any // 路由
}

interface CustomeRoutersProps {
  config:any
  match: any
  location: any
  history: any
  mobxRouter?:any
  isFind?: boolean // 是否查找那个 面包屑的东西
}

@inject('mobxRouter')
@observer
class CustomeRouters extends RootComponent<CustomeRoutersProps, CustomeRoutersState> {
  constructor (props:any) {
    super(props)
    this.state = {
      route: {}
    }
  }

  /** 初始化侧边栏的信息 */
  initRouter = () => {
    let aryMenu:any = []
    let da = Routes[0].routes
    // let authAry = SysUtil.getLocalStorage(globalEnum.auth) || []
    // if (authAry.length > 0) {
    //   authAry.unshift('0')
    //   authAry.unshift('H001000000')
    //   authAry.unshift('H002000000')
    //   authAry.unshift('H004000000')
    // }
    let levelOne = da.filter((el:any) => el.level === 1)
    let levelTwo = da.filter((el:any) => el.level === 2)
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    // 侧边栏的显示 (查询的第一级)
    levelOne.forEach((el:any) => {
      // 判断权限
      // if (authAry.indexOf(el.key) >= 0) { // 一级目录
      let two = levelTwo.filter((sub:any) => {
        if (process.env.SERVICE_URL === 'dev') {
          return sub.parent === el.key
        } else {
          let powerObj = ConfigUtil.powerObj
          let userIdAry = powerObj[`${sub.key}`]
          if (!userIdAry || (userIdAry && userIdAry.indexOf(userId) >= 0)) {
            return sub.parent === el.key
          } else {
            return false
          }
        }
      })
      aryMenu.push({ title: el.title, key: el.key, parent: el.parent, path: el.path, icon: el.icon, children: this.reFun(two) })
      // }
    })
    SysUtil.setSessionStorage('home-silder', aryMenu)
    SysUtil.setSessionStorage('home-silder-breadcrumb', da)
  }

  reFun = (data:any) => {
    return data.map((eld:any) => {
      return { title: eld.title, parent: eld.parent, index: eld.index, path: eld.path, key: eld.key }
    }).sort((a:any, b:any) => {
      if (a.index > b.index) {
        return 1
      } else if (a.index <= b.index) {
        return -1
      } else {
        return 0
      }
    })
  }

  render () {
    // 权限的判断
    this.initRouter()
    const { config, isFind, mobxRouter } = this.props
    // 主页的路由
    if (isFind) {
      if (SysUtil.isAuthExit()) {
        return <Redirect to="/login"/>
      } else {
        return (
          config.map((route:any, i:number) => (
            <Route key={i} exact={route.exact} path={route.path}
              render={props => (<RouteRender mobxRouter={mobxRouter} isFind={isFind} props={props} route={route}/>)}></Route>
          ))
        )
      }
    } else {
      return (
        config.map((route:any, i:number) => (
          <Route key={i} exact={route.exact} path={route.path}
            render={props => (<RouteRender mobxRouter={mobxRouter} isFind={isFind} props={props} route={route}/>)}></Route>
        ))
      )
    }
  }
}

const initBreadcrumb = (obj:any, parnt?:any, el?:any) => {
  let ary:any = []
  if (obj) ary.push({ title: obj.title, path: obj.path })
  if (parnt) ary.unshift({ title: parnt.title, path: parnt.path })
  if (el) ary.unshift({ title: el.title, path: el.path })
  return ary
}

const init = (routes:any, path:string) => {
  let ary = routes.find((el:any) => el.path === path)
  if (ary) {
    let pat = routes.find((el:any) => el.key === ary.parent)
    let tpat:any
    if (ary.level === 3) {
      tpat = routes.find((el:any) => el.key === pat.parent)
    }
    return [ary, pat, tpat]
  } else {
    for (let index = 0; index < routes.length; index++) {
      const el = routes[index]
      let ary = el.children
      if (ary && ary.length > 0) {
        let ob = ary.find((els:any) => els.path === path)
        return [ob, el]
      }
    }
    return []
  }
}

const RouteRender = ({ props, route, isFind, mobxRouter }:any) => {
  if (isFind) {
    const { setBreadcrumbAry, setDefaultSelectedKeys } = mobxRouter
    let routes = SysUtil.getSessionStorage('home-silder-breadcrumb')
    const { match } = props
    let [ob, pob, tpat]:any = init(routes, match.path)
    setBreadcrumbAry(initBreadcrumb(ob, pob, tpat))
    if (tpat) {
      if (pob) setDefaultSelectedKeys(pob, tpat)
    } else {
      if (ob) setDefaultSelectedKeys(ob, pob)
    }
  }
  return (<route.component {...props} routes={route.routes} />)
}

export default withRouter(CustomeRouters)
