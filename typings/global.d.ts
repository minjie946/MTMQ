/**
 * @author minjie
 * @createTime 2019/03/22
 * @description typescipt 全局加载文件
 * @copyright minjie<15181482629@163.com>
 */
import * as H from 'history'

declare interface KeyValue {
  [key: string]: any
}

declare interface RouteOption extends KeyValue {
  readonly path: string
  readonly exact: boolean
  component: any
  routes?: Array<RouteOption> | undefined
}

declare interface BaseProps {
  history?: H.History
  location?: Location
  match?: RouteMatch
  staticContext?: StaticContext
  [key: string]: any
}

interface RouteMatch {
  params: KeyValue
  isExact: boolean
  path: string
  url: string
}

interface StaticContext {
  statusCode?: number
}

interface Location extends H.Location {
  query?: KeyValue
}
