/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 人员信息查看 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  queryQuery: { // 查询员工信息--实现(已入职)
    path: 'howard/staff/{projectName}/queryUserList/{version}'
  },
  queryEdit: { // web端修改个人信息--实现(已入职)
    path: 'howard/staff/{projectName}/updateStaffInfo/{version}'
  },
  queryDetail: { // 员工信息详情查看--实现(已入职)
    type: 'get',
    path: 'howard/staff/{projectName}/getUserDetails/{version}'
  },
  queryImport: { // 新建入职导入(待入职)
    path: 'howard/staff/{projectName}/staffEntryImport/{version}'
  },
  queryManagementByOrganizeTwo: { // 获取岗位的信息
    type: 'get',
    path: 'fury/postManage/{projectName}/getManagementByOrganizeTwo/{version}'
  },
  queryExport: { // 新建入职模板下载--实现(待入职|已入职)
    type: 'get',
    path: 'howard/staff/{projectName}/employeeEntryTem/{version}'
  },
  querySubject: { // 根据组织架构查询合同信息(待入职|已入职)
    path: 'steven/ect/{projectName}/getTemplateDate/{version}'
  },
  queryContractUrl: { // 查看合同(待入职|已入职)
    type: 'get',
    path: 'steven/fdd/{projectName}/viewPdfURL/{version}'
  },
  queryNewQuery: { // web端入职员工信息查询(待入职)
    path: 'howard/staff/{projectName}/queryNewEntryList/{version}'
  },
  queryNewAdd: { // 新建员工(待入职)
    path: 'howard/staff/{projectName}/insertNewStaff/{version}'
  },
  queryNewDetail: { // web端入职员工信息详情查询(待入职)
    type: 'get',
    path: 'howard/staff/{projectName}/getNewEntryDetails/{version}'
  },
  queryNewUpdate: { // web端入职员工信息详情修改(待入职)
    path: 'howard/staff/{projectName}/updateNewEntryInfo/{version}'
  },
  queryChangeTypeToSubject: { // 根据合同主体查询到协议的信息
    type: 'get',
    path: 'steven/ect/{projectName}/getAllContractType/{version}'
  },
  electronSignTem: { // GET 新建电子签模板下载(后台/孙权庆)
    type: 'get',
    path: 'howard/staff/{projectName}/electronSignTem/{version}'
  },
  electronSignImport: { // POST 新建电子签导入(后台/孙权庆)
    path: 'howard/staff/{projectName}/electronSignImport/{version}'
  },
  insertElectronSign: { // POST 新建电子签(后台/孙权庆)
    path: 'howard/staff/{projectName}/insertElectronSign/{version}'
  },
  // 待入职审批驳回
  rebutContract: { // GET 驳回预录入及合同数据(后台/孙权庆)
    type: 'get',
    path: 'howard/facePlus/{projectName}/rebutContract/{version}'
  },
  rebutBankCard: { // POST 驳回银行卡(后台/孙权庆)
    path: 'howard/facePlus/{projectName}/rebutBankCard/{version}'
  },
  rebutSupply: { // POST 驳回补充信息(后台/孙权庆)
    path: 'howard/facePlus/{projectName}/rebutSupply/{version}'
  },
  reviewPass: { // GET 待入职通过
    type: 'get',
    path: 'howard/facePlus/{projectName}/contractPass/{version}'
  },
  // 已入职 驳回和审核
  rebutAndreview: {
    path: 'howard/staff/{projectName}/repeatSignExamine/{version}'
  },
  queryHistory: { // 获取历史记录
    path: 'howard/staff/{projectName}/getElectionSignInfo/{version}'
  },
  queryHistoryConstroct: { // 新-查看指定合同 (后台)
    type: 'get',
    path: 'steven/fdd/{projectName}/viewPdfURLTwo/{version}'
  },
  queryUpdatePhone: { // 修改用户的手机号
    path: 'howard/login/{projectName}/updateUserPhone/{version}'
  }
}
