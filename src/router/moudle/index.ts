/**
 * @author minjie
 * @createTime 2019/03/20
 * @description 获取所有的 路由配置集合
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import Loadable from 'react-loadable'
import Loading from '@components/loading/Loading'

const files = (require as any).context('.', true, /\.ts$/)
const modules:any = []

files.keys().forEach((key:any) => {
  if (key === './index.ts') return
  modules.push(...files(key).default)
})

export default [
  {
    path: '/home',
    title: '首页',
    exact: false,
    isAuthenticated: true, // 需要权限
    component: Loadable({
      loader: () => import(/* webpackChunkName: "home" */ '@pages/home/Home'),
      loading: Loading
    }),
    routes: [...modules] // 主页下的文件
  }
]
