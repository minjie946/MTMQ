/**
 * @author minjie
 * @createTime 2019/06/15
 * @description 岗位管理
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  postQuery: { // 分页模糊搜索获取岗位管理信息
    path: 'fury/postManage/{projectName}/queryManagement/{version}'
  },
  postDetail: { // 获取岗位管理信息详情用做修改
    type: 'get',
    path: 'fury/postManage/{projectName}/getManagement/{version}'
  },
  postDetailVerify: { // 获取岗位管理信息详情用做审核展示 (微信/赵伟江)
    type: 'get',
    path: 'fury/postManage/{projectName}/getManagementTwo/{version}'
  },
  postAdd: { // 批量新增岗位管理 (后台/赵伟江)
    path: 'fury/postManage/{projectName}/insertManagementBatch/{version}'
  },
  postUpdate: { // 修改岗位管理
    path: 'fury/postManage/{projectName}/updateManagement/{version}'
  },
  postReview: { // 岗位审核
    path: 'fury/postManage/{projectName}/review/{version}'
  }
}
