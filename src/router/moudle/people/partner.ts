/**
 * @author minjie
 * @createTime 2019/07/5
 * @description 合伙人
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '合伙人',
    path: '/home/people/partner',
    exact: true,
    key: 'H003003000',
    level: 2, // 等级
    index: 3, // 顺序
    parent: 'H003000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "partner" */ '@pages/main/people/partner'))
  }
]
