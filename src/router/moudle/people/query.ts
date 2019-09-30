/**
 * @author minjie
 * @createTime 2019/05/12
 * @description 人员信息查看
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '用户信息',
    path: '/home/people/query',
    exact: true,
    key: 'H003001000',
    level: 2, // 等级
    index: 1, // 侧边栏顺序
    parent: 'H003000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "query" */ '@pages/main/people/query'))
  },
  {
    title: '人员信息详情',
    path: '/home/people/detail/new/:id',
    exact: true,
    key: 'H003001001',
    level: 3, // 等级
    parent: 'H003001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "query" */ /* webpackPrefetch: true */ '@pages/main/people/query/Detail'))
  },
  {
    title: '人员详情',
    path: '/home/people/query/detail',
    exact: true,
    key: 'H003001002',
    level: 3, // 等级
    parent: 'H003001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "query" */ /* webpackPrefetch: true */ '@pages/main/people/query/Detail'))
  },
  {
    title: '人员信息详情',
    path: '/home/people/detail/old/:id',
    exact: true,
    key: 'H003001003',
    level: 3, // 等级
    parent: 'H003001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "query" */ /* webpackPrefetch: true */ '@pages/main/people/query/Detail'))
  },
  {
    title: '人员信息审批',
    path: '/home/people/review/new/:id',
    exact: true,
    key: 'H003001004',
    level: 3, // 等级
    parent: 'H003001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "query" */ /* webpackPrefetch: true */ '@pages/main/people/query/new/Review'))
  },
  {
    title: '人员信息审批',
    path: '/home/people/review/old/:id',
    exact: true,
    key: 'H003001005',
    level: 3, // 等级
    parent: 'H003001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "query" */ /* webpackPrefetch: true */ '@pages/main/people/query/old/Review'))
  },
  {
    title: '电子合同',
    path: '/home/people/query/contract/:id',
    exact: true,
    key: 'H003001006',
    level: 3, // 等级
    parent: 'H003001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "query" */ /* webpackPrefetch: true */ '@pages/main/people/query/Contract'))
  }
]
