/**
 * @author minjie
 * @createTime 2019/08/20
 * @description 看板
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  kanbanExport: { // 实名员工数据导出(后台/孙权庆)
    type: 'get',
    path: 'howard/staff/{projectName}/exportRealName/{version}'
  },
  // kanbanGetAllRunMoney: { // 所有账户余额统计(后台/孙权庆)
  //   path: 'tony/SalaryCount/{projectName}/getAllRunMoney/{version}'
  // },
  kanbanGetAlldetail: { // 查看财务看板详情(后台/孙权庆)
    path: 'tony/SalaryCount/{projectName}/queryFinancialBoard/{version}'
  },
  kanbanSend: { //  手动发送邮件(后台/周宁)
    type: 'get',
    path: 'nebula/remaining/{projectName}/sendMailManually/{version}'
  }
}
