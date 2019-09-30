/**
 * @author minjie
 * @createTime 2019/08/07
 * @description 工资
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '工资',
    path: '/home/salary/salary',
    exact: true,
    key: 'H004003000',
    level: 2, // 等级
    index: 3, // 顺序
    parent: 'H004000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "salary" */ '@pages/main/salary/salary'))
  }
]
