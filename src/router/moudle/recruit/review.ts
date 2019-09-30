/**
 * @author minjie
 * @createTime 2019/06/19
 * @description 简历审核
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '简历审核',
    path: '/home/recruit/review',
    exact: true,
    key: 'H002004000',
    level: 2, // 等级
    index: 4, // 顺序
    parent: 'H002000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "review" */ '@pages/main/recruit/review'))
  },
  {
    title: '详情',
    path: '/home/recruit/review/detail/:deliveryId',
    exact: true,
    key: 'H0020040001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H002004000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "review" */ /* webpackPrefetch: true */ '@pages/main/recruit/review/detail'))
  }
]
