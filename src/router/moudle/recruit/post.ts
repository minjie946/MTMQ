/**
 * @author minjie
 * @createTime 2019/06/15
 * @description 岗位管理
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '岗位管理',
    path: '/home/recruit/post',
    exact: true,
    key: 'H002001000',
    level: 2, // 等级
    index: 1, // 顺序
    parent: 'H002000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "post" */ '@pages/main/recruit/post'))
  }
]
