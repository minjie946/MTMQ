/**
 * @author minjie
 * @createTime 2019/08/15
 * @description banner
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: 'Banner',
    path: '/home/company/banner',
    exact: true,
    key: 'H001007000',
    level: 2, // 等级
    index: 7, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "promotion" */ '@pages/main/company/banner'))
  }
]
