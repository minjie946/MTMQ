/**
 * @author minjie
 * @createTime 2019/07/11
 * @description 公司咨讯
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '公司资讯',
    path: '/home/company/information',
    exact: true,
    key: 'H001003000',
    level: 2, // 等级
    index: 3, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "information" */ '@pages/main/company/information'))
  },
  {
    title: '新增',
    path: '/home/company/information/add',
    exact: true,
    key: 'H001003001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001003000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "information" */ /* webpackPrefetch: true */ '@pages/main/company/information/EditOrAdd'))
  },
  {
    title: '编辑',
    path: '/home/company/information/edit/:infoId',
    exact: true,
    key: 'H001003002',
    level: 3, // 等级
    index: 2, // 顺序
    parent: 'H001003000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "information" */ /* webpackPrefetch: true */ '@pages/main/company/information/EditOrAdd'))
  },
  {
    title: '详情',
    path: '/home/company/information/detail/:infoId',
    exact: true,
    key: 'H001003003',
    level: 3, // 等级
    index: 3, // 顺序
    parent: 'H001003000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "information" */ /* webpackPrefetch: true */ '@pages/main/company/information/detail'))
  }
]
