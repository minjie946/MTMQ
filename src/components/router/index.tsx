/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module axios
 * @description 路由组件封装
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { Route, RouteProps } from 'react-router-dom'
import Loadable from 'react-loadable'
import { Loading } from '@components/index'
import { BaseProps } from 'typings/global'

/**
 * 配置路由时的选项
 */
export interface RouterInterface extends RouteProps {
  /** 标题 */
  title?: string
  /** 父级路由：上一级路由的key */
  parent?: string
  /** 路由的key: 当前路由的key */
  key?: string
  /** 路由的层级：当前路由属于第几层级, 数字越小，层级越大 */
  level?: number
  /** 侧边栏的顺序 */
  index?: number
  /** 当前的路由所指向的具体的界面 */
  component?: any
  /** 下级的路由 */
  routes?: Array<RouterInterface>
}

/**
 * 路由路径配置的
 * @param loader 具体界面的引入
 * @description LoadableLoading(() => import('@pages/salary/index1'))
 */
export const LoadableLoading = (loader: () => Promise<React.ComponentType<BaseProps> | { default: React.ComponentType<BaseProps>} | any>) => {
  return Loadable({
    loader,
    loading: Loading,
    delay: 5000
  })
}

export interface RouterMoudelProps extends BaseProps {
  /** 权限的数组 */
  authorityAry?: Array<string>
  routes: Array<RouterInterface>
}

/**
 * 路由组件
 * @class RouterMoudel
 */
export default class RouterMoudel extends React.Component<RouterMoudelProps, any> {
  constructor (props:RouterMoudelProps) {
    super(props)
  }

  static defaultProps = {
    authorityAry: []
  }

  render () {
    const { routes } = this.props
    console.log(this.props)
    return (
      routes.map((route:RouterInterface, i: number) => (
        <RouteWithSubRoutes key={i} route={route}/>
      ))
    )
  }
}

/**
 * 单个的路由组件
 * @param param 路由配置的参数
 */
function RouteWithSubRoutes ({ route }:any) {
  return (<Route path={route.path} exact={route.exact} render={props => (<route.component {...props} routes={route.routes} />)}/>)
}
