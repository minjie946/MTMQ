/**
 * @description 主体的信息
 * @author minjie
 * @createTime 2019/05/14
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export class PeopleModel {
  createTime:string|undefined // 创建时间
  userId:string|undefined // 用户id
  userDataSources:string|undefined // 数据来源
  workCondition:string|undefined // 工作状态
  userOrganize:string|undefined // 部门（组织）
  postName:string|undefined // 岗位名称
  contractSubject:string|undefined // 合同主体
  ecName:string|undefined // 签署电子合同模板名称
  projectName:string|undefined // 项目名称
  contractType:string|undefined // 合同类型
  maxSalary:number|undefined // 薪资
  userName:string|undefined // 用户姓名
  sex:string|undefined // 性别【算】
  userAge:number|undefined // 【算】用户年龄（后台根据身份证号算出来）
  phoneNumber:string|undefined // 手机号
  idCard:string|undefined // 身份证号
  nativePlaceCountry:string|undefined // 户籍-国家
  nativePlaceCounty:string|undefined // 户籍-县
  nativePlaceProvince:string|undefined // 户籍-省
  nativePlaceCity:string|undefined // 户籍-市
  nativePlaceDetail:string|undefined // 户籍-详细地址
  bankCardId:string|undefined // 银行卡【单独查】
  emergencyContact:string|undefined // 紧急联系人
  emergencyPhone:string|undefined // 紧急联系人电话
  emergencyRelation:string|undefined// 紧急联系人关系
  maritalStatus:string|undefined// 婚姻状况
  houseRegisterType:string|undefined // 户口性质
  nowPlaceCountry:string|undefined // 现住址-国家
  nowPlaceProvince:string|undefined // 现住址-省
  nowPlaceCity:string|undefined // 现住址-市
  nowPlaceCounty:string|undefined // 现住址-县
  nowPlaceDetail:string|undefined // 现住址-详细地址
  highestDegree:string|undefined // 最高学历
  hasUpdate: boolean| undefined // 是否可以修改
  [index: string]: any
}

export class PeopleNewModel {
  createTime:string|undefined // 创建时间
  neId:string|undefined // 序列id
  userName:string|undefined // 用户姓名
  phoneNumber:string|undefined // 手机号
  projectName:string|undefined // 项目名称
  userOrganize:any // 部门（组织）
  contractSubject:string|undefined // 合同主体
  contractType:string|undefined // 合同类型
  postName:string|undefined // 岗位名称
  maxSalary:number|undefined // 薪资
  contractId:string|undefined // 合同编号
  createUser:string|undefined // 创建人
  fddSign: string|undefined // 创建人
  [index: string]: any
}
