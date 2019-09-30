/**
 * @author minjie
 * @createTime 2019/06/15
 * @description 在招岗位
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import Loadable from '../../loadable'

export default [
  {
    title: '在招岗位',
    path: '/home/recruit/recruitment',
    exact: true,
    key: 'H002002000',
    level: 2, // 等级
    index: 2, // 顺序
    parent: 'H002000000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "recruitment" */ '@pages/main/recruit/recruitment'))
  },
  {
    title: '新增',
    path: '/home/recruit/recruitment/editoradd',
    exact: true,
    key: 'H002002001',
    level: 3, // 等级
    index: 1, // 顺序
    parent: 'H002002000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "recruitment" */ /* webpackPrefetch: true */ '@pages/main/recruit/recruitment/editoradd'))
  },
  {
    title: '编辑',
    path: '/home/recruit/recruitment/editoradd/:prId',
    exact: true,
    key: 'H002002002',
    level: 3, // 等级
    index: 2, // 顺序
    parent: 'H002002000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "recruitment" */ /* webpackPrefetch: true */ '@pages/main/recruit/recruitment/editoradd'))
  },
  {
    title: '详情',
    path: '/home/recruit/recruitment/detail/:prId',
    exact: true,
    key: 'H002002003',
    level: 3, // 等级
    index: 3, // 顺序
    parent: 'H002002000', // 父级key
    component: Loadable(() => import(/* webpackChunkName: "recruitment" */ /* webpackPrefetch: true */ '@pages/main/recruit/recruitment/detail'))
  }
]
