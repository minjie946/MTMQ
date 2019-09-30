/**
 * @author minjie
 * @createTime 2019/07/11
 * @description 消息推送
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '消息推送',
    path: '/home/company/messagepush',
    exact: true,
    key: 'H001006000',
    level: 2, // 等级
    index: 6, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "messagepush" */ '@pages/main/company/messagepush/index'))
  },
  {
    title: '消息新增',
    path: '/home/company/messagepush/add',
    exact: true,
    key: 'H001006001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001006000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "messagepush" */ /* webpackPrefetch: true */ '@pages/main/company/messagepush/AddAndEdit'))
  },
  {
    title: '消息编辑',
    path: '/home/company/messagepush/update/:id',
    exact: true,
    key: 'H001006002',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001006000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "messagepush" */ /* webpackPrefetch: true */ '@pages/main/company/messagepush/AddAndEdit'))
  },
  {
    title: '详情',
    path: '/home/company/messagepush/detail/:id',
    exact: true,
    key: 'H001006003',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001006000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "messagepush" */ /* webpackPrefetch: true */ '@pages/main/company/messagepush/detail'))
  }
]
