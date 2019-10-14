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
import { Loading, ErrorPage } from '@components/index'
import { SysUtil } from '@utils/index'
import { BaseProps } from 'typings/global'

/**
 * 配置路由时的选项
 */
export interface RouterInterface extends RouteProps {
  /** 标题 */
  title?: string
  /** 父级路由：上一级路由的key, 没有则是最上级的路由，为页面跳转的页面 */
  parent?: string
  /** 路由的key: 当前路由的key */
  key: string
  /** (侧边栏)路由的层级：当前路由属于第几层级, 数字越小，层级越大 */
  level?: number
  /** （侧边栏）侧边栏的顺序 */
  index: number
  /** 当前的路由所指向的具体的界面 */
  component?: any
  /** 侧边栏的图标 */
  icon?: any
  /** 下级的路由 */
  routes?: Array<RouterInterface>
}

export interface SilderInterface extends RouterInterface {
  /** 下级 */
  children?: Array<SilderInterface>
}

export interface RouterMoudelProps extends BaseProps {
  /** 需要跳转的路由数组 */
  routes: Array<RouterInterface>
  /** 权限的数组: 路由的key组成的数组 */
  authorityAry?: Array<string>
  /** 不需要进行权限判断的key: 路由的key组成的数组 */
  excludeAuthorityAry?: Array<string>
  /** 是否需要侧边栏的数据 */
  silderLevel?: number
  /** 返回这个侧边栏的数据 */
  onSilderData?: (silderAry:Array<SilderInterface>) => void
  /** 获取到当前的路由的信息： 面包屑 */
  onBreadcrumb?: (breadcrumbAry:Array<BreadcrumbAryInteface>) => void
}

export interface BreadcrumbAryInteface {
  title: string|undefined
  path: string|string[]|undefined
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
    authorityAry: [],
    silderLevel: 2
  }

  componentDidMount () {
    const { routes, onSilderData, silderLevel, authorityAry, excludeAuthorityAry } = this.props
    const silderAry:Array<SilderInterface> = initSilderAry(routes, silderLevel, authorityAry || [], excludeAuthorityAry)
    if (onSilderData) onSilderData(silderAry)
  }

  /**
   * 面包屑的格式返回
   */
  onBreadcrumb = ({ match: { path, params } }:any) => {
    const { onBreadcrumb } = this.props
    let breadcrumbAry:Array<BreadcrumbAryInteface> = []
    if (onBreadcrumb) {
      const routerAry = SysUtil.getSessionStorage('routerAry')
      let nowPath:RouterInterface = { key: '', index: 0, title: '主页', path: '/' }
      for (const key in routerAry) {
        nowPath = routerAry[key].find((el:RouterInterface) => {
          return el.path === path
        })
        if (nowPath) break
      }
      breadcrumbAry = [{ title: nowPath.title, path: nowPath.path }]
      if (nowPath.level && nowPath.parent) {
        let parentKey: string = nowPath.parent
        for (let index = nowPath.level - 1; index > 0; index--) {
          const levelAry = routerAry[index]
          let levelObj:RouterInterface = levelAry.find((el:RouterInterface) => el.key === parentKey)
          if (levelObj) {
            parentKey = levelObj.parent || ''
            breadcrumbAry.unshift({ title: levelObj.title, path: levelObj.path })
            continue
          }
        }
      }
      onBreadcrumb(breadcrumbAry)
    }
  }

  render () {
    const { routes } = this.props
    return (
      routes ? routes.map((route:RouterInterface, i: number) => (
        <RouteWithSubRoutes key={i} route={route} onBreadcrumb={this.onBreadcrumb}/>
      )) : null
    )
  }
}

/**
 * 单个的路由组件
 * @param param 路由配置的参数
 */
function RouteWithSubRoutes ({ route, onBreadcrumb }:any) {
  return (<Route path={route.path} exact={route.exact} render={props => {
    if (onBreadcrumb) onBreadcrumb(props)
    if (route.component) {
      return <route.component {...props} routes={route.routes} />
    } else {
      return <ErrorPage/>
    }
  }}/>)
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

/**
 * 对路由的配置进行调整，调整成需要的格式
 * @param data           路由的信息
 * @param level          保存几级（默认 2）
 * @param authorityAry   权限的数组，存在则会判断路由的key是否存在于权限数组中，进行最后的筛选
 */
export function initSilderAry (data: Array<RouterInterface>, level: number = 2, authorityAry:Array<string>, excludeAuthorityAry?:Array<string>): Array<SilderInterface> {
  let home:RouterInterface = data.find((el:RouterInterface) => !el.parent && el.routes && el.routes.length > 0) || { routes: [], key: '', index: 1 }
  let obj: any = {}
  /** 按照层级 level 进行分类保存到 obj 对象中 */
  home.routes && home.routes.forEach((el:RouterInterface) => {
    let objKeys = Object.keys(obj)
    if (authorityAry.length > 0) {
      if (authorityAry.includes(el.key)) newFunction(objKeys, el)
      // 在排除的数组中也可以加入
      if (excludeAuthorityAry && excludeAuthorityAry.includes(el.key)) newFunction(objKeys, el)
    } else {
      newFunction(objKeys, el)
    }
  })
  let objKeys = Object.keys(obj).sort((a:string, b:string) => {
    if (Number(a) > Number(b)) return 1
    else if (Number(a) < Number(b)) return -1
    else return 0
  })
  /** 路由分好层级之后的对象 */
  if (objKeys.length > 0) SysUtil.setSessionStorage('routerAry', obj)
  return recursion(objKeys, obj, level)

  /**
   * 保存到对象里面
   * @param objKeys obj对象的属性名数组
   * @param el      for循环中路由对象
   */
  function newFunction (objKeys: string[], el: RouterInterface) {
    if (objKeys.includes(`${el.level}`)) {
      obj[`${el.level}`].push(el)
    } else {
      obj[`${el.level}`] = [el]
    }
  }

  /**
   * 递归从 obj 对象中获取 对应的下级
   * @param objKeys obj对象的属性名数组
   * @param obj     obj对象
   * @param level   返回的json数组最多有多少层级
   * @param key     递归的时候父级的key
   * @param index   从objKeys中获取的 obj 的属性名，相当于当前的层级
   */
  function recursion (objKeys: any, obj:any, level: number, key: string = '', index: number = 0):Array<SilderInterface> {
    let ary:Array<SilderInterface> = []
    let num = Number(index)
    if (index < level) {
      const objAry:Array<SilderInterface> = obj[objKeys[index]]
      objAry && objAry.forEach((el:SilderInterface, i:number) => {
        if (el.parent === key || index === 0) {
          ary.push(el)
        }
        el['children'] = recursion(objKeys, obj, level, el.key, num + 1).sort((a:SilderInterface, b:SilderInterface) => {
          if (a.index > b.index) return 1
          else if (a.index < b.index) return -1
          else return 0
        })
      })
    }
    return ary
  }
}
