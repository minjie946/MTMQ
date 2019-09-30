/**
 * @author minjie
 * @createTime 2019/08/07
 * @description 工资
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  salaryQuery: { // 发薪工资查询(后台/孙权庆)
    path: '/tony/PayOut/{projectName}/queryUserFirstBill/{version}'
  },
  salaryRemove: { // 删除发薪特定数据(后台/孙权庆)
    path: '/tony/PayOut/{projectName}/deleteBills/{version}'
  },
  salaryDrawAccounts: { // 发薪划账(后台/孙权庆)
    path: '/tony/PayOut/{projectName}/submitModLeft/{version}'
  },
  salaryRevoke: { // 划账撤销(后台/孙权庆)
    path: '/tony/PayOut/{projectName}/delimitWithdraw/{version}'
  },
  salaryExport: { // 工资导入模板下载(后台/孙权庆)
    type: 'get',
    path: '/tony/PayOut/{projectName}/exportFirstBill/{version}'
  },
  salaryImport: { // 发薪工资导入(后台/孙权庆)
    path: '/tony/PayOut/{projectName}/insertUserFirstBill/{version}'
  },
  salaryAllIdAndMoney: { // 所有的序列id和总金额(后台/孙权庆)
    path: '/tony/PayOut/{projectName}/getAllIdAndMoney/{version}'
  }
}
