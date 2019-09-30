/**
 * @author minjie
 * @createTime 2019/05/15
 * @description 公司资讯
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  informationQuery: { // 公司资讯列表-分页查看-(后台/周宁)
    path: '/nebula/InformationManage/{projectName}/queryInformationList/{version}'
  },
  informationDetail: { // 公司资讯详情-查看-(后台/周宁)
    type: 'get',
    path: '/nebula/InformationManage/{projectName}/getInformationDetail/{version}'
  },
  informationDetailToModify: { // 公司资讯详情-修改时查看-(后台/周宁)
    type: 'get',
    path: '/nebula/InformationManage/{projectName}/getDetailToModify/{version}'
  },
  informationAdd: { // 公司资讯-新增-(后台/周宁)
    path: '/nebula/InformationManage/{projectName}/addCompanyInformation/{version}'
  },
  informationUpdate: { // 公司资讯-修改-(后台/周宁)
    path: '/nebula/InformationManage/{projectName}/updateCompanyInformation/{version}'
  },
  informationShelves: { // 公司资讯-上下架-(后台/周宁)
    type: 'get',
    path: '/nebula/InformationManage/{projectName}/upDownShelvesInformation/{version}'
  },
  informationRoofPlacement: { // 公司资讯-置顶-(后台/周宁)
    type: 'get',
    path: '/nebula/InformationManage/{projectName}/updateInfoIstopState/{version}'
  }
}
