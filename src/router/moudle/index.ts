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
    component: LoadableLoading(() => import(/* webpackChunkName: "home" */ /* webpackPrefetch: true */ '@pages/login/Login'))
  },
  {
    title: 'home',
    path: '/home',
    exact: false,
    component: LoadableLoading(() => import(/* webpackChunkName: "home" */ /* webpackPrefetch: true */ '@pages/home')),
    routes: [...modules]
  }
]

export default router
