/**
 * @author minjie
 * @createTime 2019/08/07
 * @description 工资单
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  payrollQuery: { // web端工资单分页信息查看--实现
    path: '/tony/Payroll/{projectName}/getPayrollList/{version}'
  },
  payrollDetail: { // web端工资单信息详情--实现
    path: '/tony/Payroll/{projectName}/webGetUserDetails/{version}'
  },
  payrollRemove: { // 删除单条工资单数据--实现
    type: 'get',
    path: '/tony/Payroll/{projectName}/deleteAlonePayrollData/{version}'
  },
  payrollRemoveMonth: { // 删除特定年月工资单数据(后台/孙权庆)
    type: 'get',
    path: 'tony/Payroll/{projectName}/deleteYearsPayrollData/{version}'
  },
  payrollImport: { // 工资单导入
    path: '/tony/Payroll/{projectName}/insertPayroll/{version}'
  },
  payrollDowloadTemplte: { // 工资单导入模板下载(后台/孙权庆)
    type: 'get',
    path: '/tony/Payroll/{projectName}/exportPayroll/{version}'
  },
  payrollRidersImport: { // 骑手导入
    path: '/tony'
  },
  payrollRidersDowloadTemplte: { // 骑手下载导入模版
    path: '/tony'
  }
}
