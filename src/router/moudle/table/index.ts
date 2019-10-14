/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @description 路由的配置
 * @copyright minjie<15181482629@163.com>
 */
import { RouterInterface, LoadableLoading } from '@components/index'

const salary: Array<RouterInterface> = [
  {
    title: '表格',
    path: '/home/basic/table',
    exact: true,
    level: 2,
    index: 1,
    parent: '00010001',
    key: '000100010001',
    component: LoadableLoading(() => import(/* webpackChunkName: "salary" */ /* webpackPrefetch: true */ '@pages/main/table'))
  }
]

export default salary
