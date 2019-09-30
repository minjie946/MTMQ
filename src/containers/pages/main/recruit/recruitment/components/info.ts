/**
 * @description 在招岗位的
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export class PostInfo {
  userId: number | undefined // 用户id
  pmId: number | undefined // 岗位管理ID
  clearingForm: string | undefined // 结算方式  日结/月结
  contractSubject: string | undefined // 合同主体
  contractType: string | undefined // 合同类型
  highestSalary: number | undefined // 月结最高工资
  lowestSalary: number | undefined // 月结最低工资
  organize: string | undefined // 组织架构
  postDescribe: string | undefined // 岗位描述
  postFeature: string | undefined // 岗位特色
  postName: string | undefined // 岗位名称
  postRequirement: string | undefined // 岗位要求
  prId: number | undefined
  prType: string | undefined // 岗位类别
  projectName: string | undefined // 项目名称
  recruitNumber: number | undefined // 招收人数
  salary: number | undefined // 日结工资
  storeLatitude: number | undefined // 坐标纬度
  storeLongitude: number | undefined // 坐标经度
  workAddress: string | undefined // 工作地址
  city: string | undefined // 市
  province: string | undefined // 省
  district: string | undefined // 区
  electronInterviewId: number | undefined // 模板ID
  [key:string]:any
}
