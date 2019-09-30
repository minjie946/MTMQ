/**
 * @author minjie
 * @createTime 2019/08/26
 * @description 活动管理
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '活动管理',
    path: '/home/company/activity',
    exact: true,
    key: 'H001009000',
    level: 2, // 等级
    index: 9, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "sinin" */ '@pages/main/company/activity'))
  }
]
