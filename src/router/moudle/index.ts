/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @description 路由的配置
 * @copyright minjie<15181482629@163.com>
 */
import { RouterInterface, LoadableLoading } from '@components/index'

const files = (require as any).context('.', true, /\.ts$/)
const modules:Array<RouterInterface> = []

files.keys().forEach((key:any) => {
  if (key === './index.ts') return
  if (files(key).default) modules.push(...files(key).default)
})

const router:Array<RouterInterface> = [
  {
    title: '登录',
    path: '/',
    exact: true,
    key: '0000',
    index: 1,
    component: LoadableLoading(() => import(/* webpackChunkName: "home" */ /* webpackPrefetch: true */ '@pages/login/Login'))
  },
  {
    title: 'home',
    path: '/home',
    exact: false,
    key: '0001',
    index: 2,
    component: LoadableLoading(() => import(/* webpackChunkName: "home" */ /* webpackPrefetch: true */ '@pages/home')),
    routes: [
      {
        title: '基础的组件',
        path: '/home/basic',
        exact: true,
        level: 1,
        index: 1,
        key: '00010001'
      },
      ...modules
    ]
  }
]

export default router
