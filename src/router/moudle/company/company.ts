/**
 * @author minjie
 * @createTime 2019/05/12
 * @description 公司
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '公司信息',
    path: '/home/company/company',
    exact: true,
    key: 'H001002000',
    level: 2, // 等级
    index: 2, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "company" */ '@pages/main/company/company'))
  },
  {
    title: '新增',
    path: '/home/company/company/add',
    exact: true,
    key: 'H001002001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001002000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "company" */ /* webpackPrefetch: true */ '@pages/main/company/company/editOrAdd'))
  },
  {
    title: '编辑',
    path: '/home/company/company/edit/:id',
    exact: true,
    key: 'H001002002',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001002000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "company" */ /* webpackPrefetch: true */ '@pages/main/company/company/editOrAdd'))
  }
]
