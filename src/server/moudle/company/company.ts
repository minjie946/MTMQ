/**
 * @author minjie
 * @createTime 2019/05/15
 * @description 公司管理的后天接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  companyQuery: { // 分页模糊搜索获取公司信息
    path: 'fury/cp/{projectName}/queryCompany/{version}'
  },
  companyDetail: { // 根据序列ID查询公司详细信息
    type: 'get',
    path: '/fury/cp/{projectName}/getCompany/{version}'
  },
  companyUpdate: { // 修改公司信息
    path: 'fury/cp/{projectName}/updateCompany/{version}'
  },
  companyAdd: { // 新增公司信息（后台）
    path: 'fury/cp/{projectName}/addCompany/{version}'
  },
  companyGetProject: { // 获取所有项目名称
    type: 'get',
    path: 'fury/cp/{projectName}/getProjectAll/{version}'
  },
  companyGetCompanyName: { // 查询所有公司名称 / 主体 (后台/赵伟江)
    type: 'get',
    path: 'fury/cp/{projectName}/getCompanyName/{version}'
  },
  companyGetCompanyNamePro: { // 根据项目名称查询合同主体(公司名称) (新增已发布岗位使用/后台/微信合伙人)
    type: 'get',
    path: 'fury/cp/{projectName}/getCompanyNameByPro/{version}'
  },
  companyBankDetail: { // 根据序列ID查询公司详细信息用做修改公司银行账号
    type: 'get',
    path: '/fury/cp/{projectName}/getCompanyOne/{version}'
  },
  companyBankUpdate: { // 修改公司银行信息
    path: 'fury/cp/{projectName}/updateCompanyBank/{version} '
  }
}
