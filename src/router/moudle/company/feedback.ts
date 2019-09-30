/**
 * @author minjie
 * @createTime 2019/06/21
 * @description 意见反馈
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '意见反馈',
    path: '/home/company/feedback',
    exact: true,
    key: 'H001004000',
    level: 2, // 等级
    index: 4, // 顺序
    parent: 'H001000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "feedback" */ '@pages/main/company/feedback'))
  },
  {
    title: '答复',
    path: '/home/company/feedback/reply/:feedbackId',
    exact: true,
    key: 'H001004001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H001004000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "feedback" */ /* webpackPrefetch: true */ '@pages/main/company/feedback/reply'))
  }
]
