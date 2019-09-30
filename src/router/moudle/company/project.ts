/**
 * @author minjie
 * @createTime 2019/05/12
 * @description 项目信息
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '项目信息',
    path: '/home/company/project',
    exact: true,
    key: 'H001001000',
    level: 2, // 等级
    index: 1, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "project" */ '@pages/main/company/project'))
  },
  {
    title: '新增',
    path: '/home/company/add',
    exact: true,
    key: 'H001001001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "project" */ '@pages/main/company/project/AddOrEdit'))
  },
  {
    title: '修改',
    path: '/home/company/edit/:id',
    exact: true,
    key: 'H001001002',
    level: 3, // 等级
    index: 2, // 顺序
    parent: 'H001001000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "project" */ '@pages/main/company/project/AddOrEdit'))
  }
]
