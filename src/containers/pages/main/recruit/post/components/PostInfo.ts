/**
 * @description 岗位管理-数据类型等
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export class PostInfo {
  pmId: string | undefined
  organize: string | undefined
  postName: string | undefined
  brokerageOne: number | undefined
  brokerageTwo: number | undefined
  brokerageThree: number | undefined
  brokerageFour: number | undefined
  brokerageFive: number | undefined
  brokerageSix: number | undefined
  deadlineOne: number | undefined
  deadlineTwo: number | undefined
  deadlineThree: number | undefined
  deadlineFour: number | undefined
  deadlineFive: number | undefined
  deadlineSix: number | undefined
  [key:string]:any
}

export class PostInfoVer {
  pmId: number | undefined
  organize: string | undefined
  phoneNumber: string | undefined
  postName: string | undefined
  createTime: string = ''
  createUser: string | undefined
  brokerage: number | undefined
  brokerageFive: number | undefined
  brokerageFour: number | undefined
  brokerageOne: number | undefined
  brokerageSix: number | undefined
  brokerageThree: number | undefined
  brokerageTwo: number | undefined
  deadlineFive: number | undefined
  deadlineFour: number | undefined
  deadlineOne: number | undefined
  deadlineSix: number | undefined
  deadlineThree: number | undefined
  deadlineTwo: number | undefined
  [key:string]:any
}
