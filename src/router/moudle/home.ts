/**
 * @author minjie
 * @createTime 2019/03/20
 * @description 主页的模块
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../loadable'

export default [
  {
    title: '首页',
    path: '/home/homeInfo',
    key: '0',
    exact: true,
    icon: 'home',
    level: 1, // 是否是第一级
    component: Loadable(() => import(/* webpackChunkName: "home" */ /* webpackPrefetch: true */ '@pages/home/HomeInfo'))
  },
  {
    title: '项目管理',
    path: '/home/company',
    key: 'H001000000',
    icon: 'project',
    exact: true,
    level: 1 // 是否是第一级
  },
  {
    title: '人员管理',
    path: '/home/people',
    key: 'H003000000',
    icon: 'user',
    exact: true,
    level: 1 // 是否是第一级
  },
  {
    title: '招聘管理',
    path: '/home/recruit',
    key: 'H002000000',
    icon: 'team',
    exact: true,
    level: 1 // 是否是第一级
  },
  {
    title: '财务管理',
    path: '/home/salary',
    key: 'H004000000',
    icon: 'setting',
    exact: true,
    level: 1 // 是否是第一级
  }
]
