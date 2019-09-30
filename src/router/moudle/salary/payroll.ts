/**
 * @author minjie
 * @createTime 2019/08/07
 * @description 工资单
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '工资单',
    path: '/home/salary/payroll',
    exact: true,
    key: 'H004004000',
    level: 2, // 等级
    index: 4, // 顺序
    parent: 'H004000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "payroll" */ '@pages/main/salary/payroll'))
  }
]
