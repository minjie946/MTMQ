/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module components
 * @description 组件输出
 * @copyright minjie<15181482629@163.com>
 */

/** 基础组件: (可以将一个信息放在里面的) */
import RootComponent from './root'
/** 路由加载的 */
import Loading from './loading'
/** Axios 加载的 */
import { UserAxios, HFWAxios } from './axios/Instance'
/** 版本显示当前的版本号和创建的时间 */
import Version from './version'
/** modal 的弹窗 */
import BasicModal from './modal'
/** 路由的 */
import RouterMoudel, { RouterInterface, RouterMoudelProps, LoadableLoading, initSilderAry, SilderInterface, BreadcrumbAryInteface } from './router'
/** 404界面 */
import ErrorPage from './404'
/** antd 的表格进行了封装 */
import TableItem from './table'

export { URLInterface } from './axios/Axios'

export {
  UserAxios,
  HFWAxios,
  ErrorPage,
  TableItem,
  RootComponent,
  Loading,
  Version,
  BasicModal,
  RouterMoudel,
  RouterInterface,
  RouterMoudelProps,
  LoadableLoading,
  initSilderAry,
  SilderInterface,
  BreadcrumbAryInteface
}
