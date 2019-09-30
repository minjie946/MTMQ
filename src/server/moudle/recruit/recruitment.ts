/**
 * @author minjie
 * @createTime 2019/06/17
 * @description 在招岗位
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  recruitmentQuery: { // 分页查看已发布岗位 (后台/赵伟江)
    path: 'fury/postRele/{projectName}/queryRelease/{version}'
  },
  recruitmentDetail: { // 已发布岗位详情查看后台修改使用 (后台/赵伟江)
    type: 'get',
    path: 'fury/postRele/{projectName}/getReleaseDetailOne/{version}'
  },
  recruitmentAdd: { // 新增发布岗位 (微信/赵伟江)
    path: 'fury/postRele/{projectName}/insertRelease/{version}'
  },
  recruitmentEdit: { // 修改发布岗位 (后台/赵伟江)
    path: 'fury/postRele/{projectName}/updateReleaseOne/{version}'
  },
  recruitmentUpperShelf: { // 已发布岗位上下架 (后台/赵伟江)
    path: 'fury/postRele/{projectName}/updateReleaseStatus/{version}'
  },
  recruitmentHelpWanted: { // 已发布岗位急聘设置 (后台/赵伟江)
    path: 'fury/postRele/{projectName}/updateReleaseHurri/{version}'
  },
  recruitmentCity: { // 获取所有省市区用作发布岗位使用 (微信/赵伟江)
    type: 'get',
    path: 'fury/city/{projectName}/getAll/{version}'
  },
  recruitmentPost: { // 根据组织架构查询岗位名称 (微信/赵伟江)
    type: 'get',
    path: 'fury/postManage/{projectName}/getManagementByOrganize/{version}'
  },
  recruitmentGetContractFrom: { // 根据公司名称获取合同类型和结算方式
    type: 'get',
    path: 'steven/ect/{projectName}/getContractFrom/{version}'
  },
  recruitmentGetOrganize: { // 根据电子面试模板ID查询所有已发布岗位 (后台/赵伟江)
    type: 'get',
    path: 'fury/postRele/{projectName}/getOrganize/{version}'
  }
}
