/**
 * @author maqian
 * @createTime 2019/07/12
 * @description 晋升通道
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  PromotionQuery: { // 查看晋升通道模板列表-分页查询
    path: 'nebula/BannerManage/{projectName}/getPromotionTemplateList/{version}'
  },
  PromotionDetailAdd: { // 新建晋升通道模板
    path: 'nebula/BannerManage/{projectName}/addPromotionChannelTemplate/{version}'
  },
  PromotionDetailEdit: { // 编辑晋升通道模板
    path: 'nebula/BannerManage/{projectName}/editPromotionChannelTemplate/{version}'
  },
  PromotionDetailInfo: { // 查看晋升通道模板-编辑
    type: 'get',
    path: 'nebula/BannerManage/{projectName}/getTemplateInfoForEdit/{version}'
  },
  PromotionList: { // GET 根据组织架构查询岗位名称 (后台(晋升通道))/赵伟江
    type: 'get',
    path: 'fury/postManage/{projectName}/getManagementByOrganizeOne/{version}'
  }
}
