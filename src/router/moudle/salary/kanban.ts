/**
 * @author maqian
 * @createTime 2019/07/11
 * @description 预支
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '看板',
    path: '/home/salary/kanban',
    exact: true,
    key: 'H004005000',
    level: 2, // 等级
    index: 5, // 顺序
    parent: 'H004000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "advance" */ '@pages/main/salary/kanban'))
  }
]
