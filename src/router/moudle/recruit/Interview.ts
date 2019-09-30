/**
 * @author minjie
 * @createTime 2019/06/19
 * @description 电子面试
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '电子面试',
    path: '/home/recruit/interview',
    exact: true,
    key: 'H002003000',
    level: 2, // 等级
    index: 3, // 顺序
    parent: 'H002000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "Interview" */ '@pages/main/recruit/Interview'))
  },
  {
    title: '详情',
    path: '/home/recruit/interview/add',
    exact: true,
    key: 'H002003001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H002003000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "Interview" */ /* webpackPrefetch: true */ '@pages/main/recruit/Interview/add'))
  },
  {
    title: '编辑',
    path: '/home/recruit/interview/edit/:electronInterviewId',
    exact: true,
    key: 'H002003002',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H002003000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "Interview" */ /* webpackPrefetch: true */ '@pages/main/recruit/Interview/update'))
  }
]
