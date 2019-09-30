/**
 * @author minjie
 * @createTime 2019/06/19
 * @description 佣金
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '佣金',
    path: '/home/salary/commission',
    exact: true,
    key: 'H004001000',
    level: 2, // 等级
    index: 1, // 顺序
    parent: 'H004000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "commission" */ '@pages/main/salary/commission'))
  }
]
