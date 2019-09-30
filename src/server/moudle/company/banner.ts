/**
 * @author minjie
 * @createTime 2019/05/15
 * @description 公司管理的后天接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  bannerQuery: { // 轮播图-查看-(后台/周宁)
    type: 'get',
    path: '/nebula/BannerManage/{projectName}/querySowingMapList/{version}'
  },
  bannerRemove: { // 轮播图-删除-(后台/周宁)
    type: 'get',
    path: '/nebula/BannerManage/{projectName}/deleteSowingMap/{version}'
  },
  bannerUpdate: { // 轮播图-修改-(后台/周宁)
    path: '/nebula/BannerManage/{projectName}/updateSowingMap/{version}'
  },
  bannerAdd: { // 轮播图-发布-(后台/周宁)
    path: '/nebula/BannerManage/{projectName}/insertSowingMap/{version}'
  },
  bannerQueryPost: { // 根据组织查询岗位
    type: 'get',
    path: 'fury/postRele/{projectName}/getPostNameByOrganize/{version}'
  }
}
