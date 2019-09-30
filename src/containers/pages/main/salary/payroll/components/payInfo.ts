/**
 * @description 工资单 收入支出的计算查询
 * @author minjie
 * @createTime 2019/08/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import { JudgeUtil } from '@utils/index'

export const payDetail = (val:any) => {
  let payData = []
  let incomeData = []
  let zeroData = []
  // 基本工资
  if (val.payrollBasePay < 0 && val.payrollBasePay !== null) {
    payData.push({
      name: '基本工资',
      value: JudgeUtil.doubleFormat(val.payrollBasePay, 2)
    })
  } else if (val.payrollBasePay >= 0 && val.payrollBasePay !== null) {
    incomeData.push({
      name: '基本工资',
      value: JudgeUtil.doubleFormat(val.payrollBasePay, 2)
    })
  } else {
    zeroData.push({
      name: '基本工资',
      value: JudgeUtil.doubleFormat(val.payrollBasePay, 2)
    })
  }

  // 绩效工资
  if (val.payrollAchievementWages < 0 && val.payrollAchievementWages !== null) {
    payData.push({
      name: '绩效工资',
      value: JudgeUtil.doubleFormat(val.payrollAchievementWages, 2)
    })
  } else if (val.payrollAchievementWages >= 0 && val.payrollAchievementWages !== null) {
    incomeData.push({
      name: '绩效工资',
      value: JudgeUtil.doubleFormat(val.payrollAchievementWages, 2)
    })
  } else {
    zeroData.push({
      name: '绩效工资',
      value: JudgeUtil.doubleFormat(val.payrollAchievementWages, 2)
    })
  }

  // 绩效奖金
  if (val.payrollAchievementBonus < 0 && val.payrollAchievementBonus !== null) {
    payData.push({
      name: '绩效奖金',
      value: JudgeUtil.doubleFormat(val.payrollAchievementBonus, 2)
    })
  } else if (val.payrollAchievementBonus >= 0 && val.payrollAchievementBonus !== null) {
    incomeData.push({
      name: '绩效奖金',
      value: JudgeUtil.doubleFormat(val.payrollAchievementBonus, 2)
    })
  } else {
    zeroData.push({
      name: '绩效奖金',
      value: JudgeUtil.doubleFormat(val.payrollAchievementBonus, 2)
    })
  }

  // 层级工资
  if (val.payrollHierarchyWages < 0 && val.payrollHierarchyWages !== null) {
    payData.push({
      name: '层级工资',
      value: JudgeUtil.doubleFormat(val.payrollHierarchyWages, 2)
    })
  } else if (val.payrollHierarchyWages >= 0 && val.payrollHierarchyWages !== null) {
    incomeData.push({
      name: '层级工资',
      value: JudgeUtil.doubleFormat(val.payrollHierarchyWages, 2)
    })
  } else {
    zeroData.push({
      name: '层级工资',
      value: JudgeUtil.doubleFormat(val.payrollHierarchyWages, 2)
    })
  }

  // 加班费
  if (val.payrollOvertimePay < 0 && val.payrollOvertimePay !== null) {
    payData.push({
      name: '加班费',
      value: JudgeUtil.doubleFormat(val.payrollOvertimePay, 2)
    })
  } else if (val.payrollOvertimePay >= 0 && val.payrollOvertimePay !== null) {
    incomeData.push({
      name: '加班费',
      value: JudgeUtil.doubleFormat(val.payrollOvertimePay, 2)
    })
  } else {
    zeroData.push({
      name: '加班费',
      value: JudgeUtil.doubleFormat(val.payrollOvertimePay, 2)
    })
  }

  // 事假扣款
  if (val.payrollLeaveDeduction <= 0 && val.payrollLeaveDeduction !== null) {
    payData.push({
      name: '事假扣款',
      value: JudgeUtil.doubleFormat(val.payrollLeaveDeduction, 2)
    })
  } else if (val.payrollLeaveDeduction > 0 && val.payrollLeaveDeduction !== null) {
    incomeData.push({
      name: '事假扣款',
      value: JudgeUtil.doubleFormat(val.payrollLeaveDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '事假扣款',
      value: JudgeUtil.doubleFormat(val.payrollLeaveDeduction, 2)
    })
  }

  // 病假扣款
  if (val.payrollSickLeaveDeduction <= 0 && val.payrollSickLeaveDeduction !== null) {
    payData.push({
      name: '病假扣款',
      value: JudgeUtil.doubleFormat(val.payrollSickLeaveDeduction, 2)
    })
  } else if (val.payrollSickLeaveDeduction > 0 && val.payrollSickLeaveDeduction !== null) {
    incomeData.push({
      name: '病假扣款',
      value: JudgeUtil.doubleFormat(val.payrollSickLeaveDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '病假扣款',
      value: JudgeUtil.doubleFormat(val.payrollSickLeaveDeduction, 2)
    })
  }

  // 产假扣款
  if (val.payrollMaternityLeaveDeduction <= 0 && val.payrollMaternityLeaveDeduction !== null) {
    payData.push({
      name: '产假扣款',
      value: JudgeUtil.doubleFormat(val.payrollMaternityLeaveDeduction, 2)
    })
  } else if (val.payrollMaternityLeaveDeduction > 0 && val.payrollMaternityLeaveDeduction !== null) {
    incomeData.push({
      name: '产假扣款',
      value: JudgeUtil.doubleFormat(val.payrollMaternityLeaveDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '产假扣款',
      value: JudgeUtil.doubleFormat(val.payrollMaternityLeaveDeduction, 2)
    })
  }

  // 旷工扣款
  if (val.payrollAbsenteeismDeduction <= 0 && val.payrollAbsenteeismDeduction !== null) {
    payData.push({
      name: '旷工扣款',
      value: JudgeUtil.doubleFormat(val.payrollAbsenteeismDeduction, 2)
    })
  } else if (val.payrollAbsenteeismDeduction > 0 && val.payrollAbsenteeismDeduction !== null) {
    incomeData.push({
      name: '旷工扣款',
      value: JudgeUtil.doubleFormat(val.payrollAbsenteeismDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '旷工扣款',
      value: JudgeUtil.doubleFormat(val.payrollAbsenteeismDeduction, 2)
    })
  }

  // 提成工资
  if (val.payrollExtractWages < 0 && val.payrollExtractWages !== null) {
    payData.push({
      name: '提成工资',
      value: JudgeUtil.doubleFormat(val.payrollExtractWages, 2)
    })
  } else if (val.payrollExtractWages >= 0 && val.payrollExtractWages !== null) {
    incomeData.push({
      name: '提成工资',
      value: JudgeUtil.doubleFormat(val.payrollExtractWages, 2)
    })
  } else {
    zeroData.push({
      name: '提成工资',
      value: JudgeUtil.doubleFormat(val.payrollExtractWages, 2)
    })
  }

  // 拉新
  if (val.payrollPullNewPeople < 0 && val.payrollPullNewPeople !== null) {
    payData.push({
      name: '拉新',
      value: JudgeUtil.doubleFormat(val.payrollPullNewPeople, 2)
    })
  } else if (val.payrollPullNewPeople >= 0 && val.payrollPullNewPeople !== null) {
    incomeData.push({
      name: '拉新',
      value: JudgeUtil.doubleFormat(val.payrollPullNewPeople, 2)
    })
  } else {
    zeroData.push({
      name: '拉新',
      value: JudgeUtil.doubleFormat(val.payrollPullNewPeople, 2)
    })
  }

  // 计件收入
  if (val.payrollPieceworkIncome < 0 && val.payrollPieceworkIncome !== null) {
    payData.push({
      name: '计件收入',
      value: JudgeUtil.doubleFormat(val.payrollPieceworkIncome, 2)
    })
  } else if (val.payrollPieceworkIncome >= 0 && val.payrollPieceworkIncome !== null) {
    incomeData.push({
      name: '计件收入',
      value: JudgeUtil.doubleFormat(val.payrollPieceworkIncome, 2)
    })
  } else {
    zeroData.push({
      name: '计件收入',
      value: JudgeUtil.doubleFormat(val.payrollPieceworkIncome, 2)
    })
  }

  // 异动津贴
  if (val.payrollTransactionAllowance < 0 && val.payrollTransactionAllowance !== null) {
    payData.push({
      name: '异动津贴',
      value: JudgeUtil.doubleFormat(val.payrollTransactionAllowance, 2)
    })
  } else if (val.payrollTransactionAllowance >= 0 && val.payrollTransactionAllowance !== null) {
    incomeData.push({
      name: '异动津贴',
      value: JudgeUtil.doubleFormat(val.payrollTransactionAllowance, 2)
    })
  } else {
    zeroData.push({
      name: '异动津贴',
      value: JudgeUtil.doubleFormat(val.payrollTransactionAllowance, 2)
    })
  }

  // 餐补
  if (val.payrollMealSupplement < 0 && val.payrollMealSupplement !== null) {
    payData.push({
      name: '餐补',
      value: JudgeUtil.doubleFormat(val.payrollMealSupplement, 2)
    })
  } else if (val.payrollMealSupplement >= 0 && val.payrollMealSupplement !== null) {
    incomeData.push({
      name: '餐补',
      value: JudgeUtil.doubleFormat(val.payrollMealSupplement, 2)
    })
  } else {
    zeroData.push({
      name: '餐补',
      value: JudgeUtil.doubleFormat(val.payrollMealSupplement, 2)
    })
  }

  // 推荐奖金
  if (val.payrollRecommend < 0 && val.payrollRecommend !== null) {
    payData.push({
      name: '推荐奖金',
      value: JudgeUtil.doubleFormat(val.payrollRecommend, 2)
    })
  } else if (val.payrollRecommend >= 0 && val.payrollRecommend !== null) {
    incomeData.push({
      name: '推荐奖金',
      value: JudgeUtil.doubleFormat(val.payrollRecommend, 2)
    })
  } else {
    zeroData.push({
      name: '推荐奖金',
      value: JudgeUtil.doubleFormat(val.payrollRecommend, 2)
    })
  }

  // 高温费
  if (val.payrollHeatSalary < 0 && val.payrollHeatSalary !== null) {
    payData.push({
      name: '高温费',
      value: JudgeUtil.doubleFormat(val.payrollHeatSalary, 2)
    })
  } else if (val.payrollHeatSalary >= 0 && val.payrollHeatSalary !== null) {
    incomeData.push({
      name: '高温费',
      value: JudgeUtil.doubleFormat(val.payrollHeatSalary, 2)
    })
  } else {
    zeroData.push({
      name: '高温费',
      value: JudgeUtil.doubleFormat(val.payrollHeatSalary, 2)
    })
  }

  // 夜班津贴
  if (val.payrollNightShiftSalary < 0 && val.payrollNightShiftSalary !== null) {
    payData.push({
      name: '夜班津贴',
      value: JudgeUtil.doubleFormat(val.payrollNightShiftSalary, 2)
    })
  } else if (val.payrollNightShiftSalary >= 0 && val.payrollNightShiftSalary !== null) {
    incomeData.push({
      name: '夜班津贴',
      value: JudgeUtil.doubleFormat(val.payrollNightShiftSalary, 2)
    })
  } else {
    zeroData.push({
      name: '夜班津贴',
      value: JudgeUtil.doubleFormat(val.payrollNightShiftSalary, 2)
    })
  }

  // 最低工资补足
  if (val.payrollMinSalarySubsidy < 0 && val.payrollMinSalarySubsidy !== null) {
    payData.push({
      name: '最低工资补足',
      value: JudgeUtil.doubleFormat(val.payrollMinSalarySubsidy, 2)
    })
  } else if (val.payrollMinSalarySubsidy >= 0 && val.payrollMinSalarySubsidy !== null) {
    incomeData.push({
      name: '最低工资补足',
      value: JudgeUtil.doubleFormat(val.payrollMinSalarySubsidy, 2)
    })
  } else {
    zeroData.push({
      name: '最低工资补足',
      value: JudgeUtil.doubleFormat(val.payrollMinSalarySubsidy, 2)
    })
  }

  // 税前调整
  if (val.payrollPretaxAdjustment < 0 && val.payrollPretaxAdjustment !== null) {
    payData.push({
      name: '税前调整',
      value: JudgeUtil.doubleFormat(val.payrollPretaxAdjustment, 2)
    })
  } else if (val.payrollPretaxAdjustment >= 0 && val.payrollPretaxAdjustment !== null) {
    incomeData.push({
      name: '税前调整',
      value: JudgeUtil.doubleFormat(val.payrollPretaxAdjustment, 2)
    })
  } else {
    zeroData.push({
      name: '税前调整',
      value: JudgeUtil.doubleFormat(val.payrollPretaxAdjustment, 2)
    })
  }

  // 其它津贴
  if (val.payrollSalaryProject < 0 && val.payrollSalaryProject !== null) {
    payData.push({
      name: '其它津贴',
      value: JudgeUtil.doubleFormat(val.payrollSalaryProject, 2)
    })
  } else if (val.payrollSalaryProject >= 0 && val.payrollSalaryProject !== null) {
    incomeData.push({
      name: '其它津贴',
      value: JudgeUtil.doubleFormat(val.payrollSalaryProject, 2)
    })
  } else {
    zeroData.push({
      name: '其它津贴',
      value: JudgeUtil.doubleFormat(val.payrollSalaryProject, 2)
    })
  }

  // 医疗扣款
  if (val.payrollMedicalCareDeduction <= 0 && val.payrollMedicalCareDeduction !== null) {
    payData.push({
      name: '医疗扣款',
      value: JudgeUtil.doubleFormat(val.payrollMedicalCareDeduction, 2)
    })
  } else if (val.payrollMedicalCareDeduction > 0 && val.payrollMedicalCareDeduction !== null) {
    incomeData.push({
      name: '医疗扣款',
      value: JudgeUtil.doubleFormat(val.payrollMedicalCareDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '医疗扣款',
      value: JudgeUtil.doubleFormat(val.payrollMedicalCareDeduction, 2)
    })
  }

  // 失业扣款
  if (val.payrollUnemploymentDeduction <= 0 && val.payrollUnemploymentDeduction !== null) {
    payData.push({
      name: '失业扣款',
      value: JudgeUtil.doubleFormat(val.payrollUnemploymentDeduction, 2)
    })
  } else if (val.payrollUnemploymentDeduction > 0 && val.payrollUnemploymentDeduction !== null) {
    incomeData.push({
      name: '失业扣款',
      value: JudgeUtil.doubleFormat(val.payrollUnemploymentDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '失业扣款',
      value: JudgeUtil.doubleFormat(val.payrollUnemploymentDeduction, 2)
    })
  }

  // 公积金扣款
  if (val.payrollAccumulationFundDeduction <= 0 && val.payrollAccumulationFundDeduction !== null) {
    payData.push({
      name: '公积金扣款',
      value: JudgeUtil.doubleFormat(val.payrollAccumulationFundDeduction, 2)
    })
  } else if (val.payrollAccumulationFundDeduction > 0 && val.payrollAccumulationFundDeduction !== null) {
    incomeData.push({
      name: '公积金扣款',
      value: JudgeUtil.doubleFormat(val.payrollAccumulationFundDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '公积金扣款',
      value: JudgeUtil.doubleFormat(val.payrollAccumulationFundDeduction, 2)
    })
  }

  // 经济补贴
  if (val.payrollEconomicSubsidies < 0 && val.payrollEconomicSubsidies !== null) {
    payData.push({
      name: '经济补贴',
      value: JudgeUtil.doubleFormat(val.payrollEconomicSubsidies, 2)
    })
  } else if (val.payrollEconomicSubsidies >= 0 && val.payrollEconomicSubsidies !== null) {
    incomeData.push({
      name: '经济补贴',
      value: JudgeUtil.doubleFormat(val.payrollEconomicSubsidies, 2)
    })
  } else {
    zeroData.push({
      name: '经济补贴',
      value: JudgeUtil.doubleFormat(val.payrollEconomicSubsidies, 2)
    })
  }

  // 个人所得税
  if (val.payrollIncomeTax <= 0 && val.payrollIncomeTax !== null) {
    payData.push({
      name: '个人所得税',
      value: JudgeUtil.doubleFormat(val.payrollIncomeTax, 2)
    })
  } else if (val.payrollIncomeTax > 0 && val.payrollIncomeTax !== null) {
    incomeData.push({
      name: '个人所得税',
      value: JudgeUtil.doubleFormat(val.payrollIncomeTax, 2)
    })
  } else {
    zeroData.push({
      name: '个人所得税',
      value: JudgeUtil.doubleFormat(val.payrollIncomeTax, 2)
    })
  }

  // 健康证
  if (val.payrollHealthCertificate <= 0 && val.payrollHealthCertificate !== null) {
    payData.push({
      name: '健康证',
      value: JudgeUtil.doubleFormat(val.payrollHealthCertificate, 2)
    })
  } else if (val.payrollHealthCertificate > 0 && val.payrollHealthCertificate !== null) {
    incomeData.push({
      name: '健康证',
      value: JudgeUtil.doubleFormat(val.payrollHealthCertificate, 2)
    })
  } else {
    zeroData.push({
      name: '健康证',
      value: JudgeUtil.doubleFormat(val.payrollHealthCertificate, 2)
    })
  }

  // 实发金额
  // if (val.payrollRealHairMoney < 0 && val.payrollRealHairMoney !== null) {
  //   payData.push({
  //     name: '实发金额',
  //     value: JudgeUtil.doubleFormat(val.payrollRealHairMoney, 2)
  //   })
  // } else if (val.payrollRealHairMoney >= 0 && val.payrollRealHairMoney !== null) {
  //   incomeData.push({
  //     name: '实发金额',
  //     value: JudgeUtil.doubleFormat(val.payrollRealHairMoney, 2)
  //   })
  // } else {
  //   zeroData.push({
  //     name: '实发金额',
  //     value: JudgeUtil.doubleFormat(val.payrollRealHairMoney, 2)
  //   })
  // }

  // 13薪
  if (val.payrollThirteenPay < 0 && val.payrollThirteenPay !== null) {
    payData.push({
      name: '13薪',
      value: JudgeUtil.doubleFormat(val.payrollThirteenPay, 2)
    })
  } else if (val.payrollThirteenPay >= 0 && val.payrollThirteenPay !== null) {
    incomeData.push({
      name: '13薪',
      value: JudgeUtil.doubleFormat(val.payrollThirteenPay, 2)
    })
  } else {
    zeroData.push({
      name: '13薪',
      value: JudgeUtil.doubleFormat(val.payrollThirteenPay, 2)
    })
  }

  // 年终奖
  if (val.payrollAnnualBonus < 0 && val.payrollAnnualBonus !== null) {
    payData.push({
      name: '年终奖',
      value: JudgeUtil.doubleFormat(val.payrollAnnualBonus, 2)
    })
  } else if (val.payrollAnnualBonus >= 0 && val.payrollAnnualBonus !== null) {
    incomeData.push({
      name: '年终奖',
      value: JudgeUtil.doubleFormat(val.payrollAnnualBonus, 2)
    })
  } else {
    zeroData.push({
      name: '年终奖',
      value: JudgeUtil.doubleFormat(val.payrollAnnualBonus, 2)
    })
  }

  // 奖金
  if (val.payrollBonus < 0 && val.payrollBonus !== null) {
    payData.push({
      name: '奖金',
      value: JudgeUtil.doubleFormat(val.payrollBonus, 2)
    })
  } else if (val.payrollBonus >= 0 && val.payrollBonus !== null) {
    incomeData.push({
      name: '奖金',
      value: JudgeUtil.doubleFormat(val.payrollBonus, 2)
    })
  } else {
    zeroData.push({
      name: '奖金',
      value: JudgeUtil.doubleFormat(val.payrollBonus, 2)
    })
  }

  // 特殊补助
  if (val.payrollSpecialSubsidy < 0 && val.payrollSpecialSubsidy !== null) {
    payData.push({
      name: '特殊补助',
      value: JudgeUtil.doubleFormat(val.payrollSpecialSubsidy, 2)
    })
  } else if (val.payrollSpecialSubsidy >= 0 && val.payrollSpecialSubsidy !== null) {
    incomeData.push({
      name: '特殊补助',
      value: JudgeUtil.doubleFormat(val.payrollSpecialSubsidy, 2)
    })
  } else {
    zeroData.push({
      name: '特殊补助',
      value: JudgeUtil.doubleFormat(val.payrollSpecialSubsidy, 2)
    })
  }

  // 住宿扣款
  if (val.payrollLiveDeduction <= 0 && val.payrollLiveDeduction !== null) {
    payData.push({
      name: '住宿扣款',
      value: JudgeUtil.doubleFormat(val.payrollLiveDeduction, 2)
    })
  } else if (val.payrollLiveDeduction > 0 && val.payrollLiveDeduction !== null) {
    incomeData.push({
      name: '住宿扣款',
      value: JudgeUtil.doubleFormat(val.payrollLiveDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '住宿扣款',
      value: JudgeUtil.doubleFormat(val.payrollLiveDeduction, 2)
    })
  }

  // 其他扣款
  if (val.payrollOtherDeduction <= 0 && val.payrollOtherDeduction !== null) {
    payData.push({
      name: '其他扣款',
      value: JudgeUtil.doubleFormat(val.payrollOtherDeduction, 2)
    })
  } else if (val.payrollOtherDeduction > 0 && val.payrollOtherDeduction !== null) {
    incomeData.push({
      name: '其他扣款',
      value: JudgeUtil.doubleFormat(val.payrollOtherDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '其他扣款',
      value: JudgeUtil.doubleFormat(val.payrollOtherDeduction, 2)
    })
  }

  // 养老扣款
  if (val.payrollPensionDeduction <= 0 && val.payrollPensionDeduction !== null) {
    payData.push({
      name: '养老扣款',
      value: JudgeUtil.doubleFormat(val.payrollPensionDeduction, 2)
    })
  } else if (val.payrollPensionDeduction > 0 && val.payrollPensionDeduction !== null) {
    incomeData.push({
      name: '养老扣款',
      value: JudgeUtil.doubleFormat(val.payrollPensionDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '养老扣款',
      value: JudgeUtil.doubleFormat(val.payrollPensionDeduction, 2)
    })
  }

  // 大病医疗扣款
  if (val.payrollBigMedicalCareDeduction <= 0 && val.payrollBigMedicalCareDeduction !== null) {
    payData.push({
      name: '大病医疗扣款',
      value: JudgeUtil.doubleFormat(val.payrollBigMedicalCareDeduction, 2)
    })
  } else if (val.payrollBigMedicalCareDeduction > 0 && val.payrollBigMedicalCareDeduction !== null) {
    incomeData.push({
      name: '大病医疗扣款',
      value: JudgeUtil.doubleFormat(val.payrollBigMedicalCareDeduction, 2)
    })
  } else {
    zeroData.push({
      name: '大病医疗扣款',
      value: JudgeUtil.doubleFormat(val.payrollBigMedicalCareDeduction, 2)
    })
  }

  // 税后补发
  if (val.payrollPostTaxReplacement < 0 && val.payrollPostTaxReplacement !== null) {
    payData.push({
      name: '税后补发',
      value: JudgeUtil.doubleFormat(val.payrollPostTaxReplacement, 2)
    })
  } else if (val.payrollPostTaxReplacement >= 0 && val.payrollPostTaxReplacement !== null) {
    incomeData.push({
      name: '税后补发',
      value: JudgeUtil.doubleFormat(val.payrollPostTaxReplacement, 2)
    })
  } else {
    zeroData.push({
      name: '税后补发',
      value: JudgeUtil.doubleFormat(val.payrollPostTaxReplacement, 2)
    })
  }
  return {
    payData, // 支出
    incomeData, // 收入
    zeroData // 为空
  }
}
