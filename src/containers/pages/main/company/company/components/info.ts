/**
 * @description 公司信息-常用的信息
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { JudgeUtil } from '@utils/index'

export const industryCategoryAry = [
  '农林牧渔', '医药卫生', '建筑建材', '冶金矿产', '石油化工',
  '水利水电', '交通运输', '信息产业', '机械机电', '轻工食品',
  '服装纺织', '专业服务', '安全防护', '环保绿化', '旅游休闲',
  '办公文教', '电子电工', '玩具礼品', '家居用品', '物资', '包装', '体育', '办公',
  '信息传输', '计算机服务和软件业', '仓储业和邮政业', '居民服务和其他服务业' ]

export class Info {
  // 序列ID
  cId:number | undefined
  // 创建时间
  createTime:number | undefined
  // 公司成立时间
  foundTime:number | undefined
  // 注册资本  单位/万元
  registeredCapital:number | undefined
  // 公司简称
  abbreviation:string | undefined
  // 公司地址
  address:string | undefined
  // 公司名称
  companyName:string | undefined
  // 行业类别
  industryCategory:string | undefined
  // 公司简介
  introduce:string | undefined
  // 公司法人
  legalPerson:string | undefined
  // 公司性质
  nature:string | undefined
  // 联系电话
  phoneNumber:string | undefined
  // 所属项目
  projectName:string | undefined
  // 公司规模
  scale:string | undefined
}
