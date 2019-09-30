/**
 * @author minjie
 * @createTime 2019/05/12
 * @description 电子合同
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '电子合同',
    path: '/home/people/contract',
    exact: true,
    key: 'H003002000',
    level: 2, // 等级
    index: 2, // 顺序
    parent: 'H003000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "contract" */ '@pages/main/people/contract'))
  },
  // {
  //   title: '电子合同新增',
  //   path: '/home/people/contract/add',
  //   exact: true,
  //   key: 'H003002001',
  //   level: 3, // 等级
  //   parent: 'H003001000', // 父级key
  //   component: Loadable(() => import(/* webpackChunkName: "contract" */ /* webpackPrefetch: true */ '@pages/main/people/contract/ContractAdd'))
  // },
  {
    title: '电子合同详情',
    path: '/home/people/contract/detail/:id',
    exact: true,
    key: 'H003002002',
    level: 3, // 等级
    parent: 'H003002000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "contract" */ /* webpackPrefetch: true */ '@pages/main/people/contract/ContractDetail'))
  }
]
