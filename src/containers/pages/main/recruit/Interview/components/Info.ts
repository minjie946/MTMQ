/**
 * @description 电子面试的
 * @author minjie
 * @createTime 2019/06/24
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
export class QuestionInfo {
  eiqId: number | undefined // 管理的ID
  electronInterviewId: number | undefined // 电子面试ID
  questionNumber: string | undefined // 问题名称
  questionValue: string | undefined // 问题类型
}

export class InterViewInfo {
  electronInterviewId: number | undefined // 电子面试ID
  available: string | undefined // 上下架
  questionList: Array<QuestionInfo> | undefined // 问题的数组
  startSentence: string | undefined // 开场白
  templateName: string | undefined // 模板名称
  userId: number | undefined // 用户ID
  [key:string]:any
}
