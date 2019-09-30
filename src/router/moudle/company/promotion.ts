/**
 * @author maqian
 * @createTime 2019/07/12
 * @description 晋升通道
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '晋升通道',
    path: '/home/company/promotion',
    exact: true,
    key: 'H001005000',
    level: 2, // 等级
    index: 5, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "promotion" */ '@pages/main/company/promotion'))
  },
  {
    title: '新增/编辑',
    path: '/home/company/promotionDetail',
    exact: true,
    key: 'H001005001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001005000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "promotion" */ /* webpackPrefetch: true */ '@pages/main/company/promotion/detail'))
  }
]
