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
    title: 'one',
    path: '/home/one',
    exact: true,
    component: LoadableLoading(() => import(/* webpackChunkName: "salary" */ /* webpackPrefetch: true */ '@pages/salary/index'))
  },
  {
    title: 'two',
    path: '/home/two',
    exact: true,
    component: LoadableLoading(() => import(/* webpackChunkName: "salary" */ /* webpackPrefetch: true */ '@pages/salary/index1'))
  }
]

export default salary
