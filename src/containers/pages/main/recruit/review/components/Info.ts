/**
 * @description 简历审核
 * @author minjie
 * @createTime 2019/06/24
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export class QuestionInfo {
  deliveryId: number | undefined
  electronInterviewId: number | undefined
  questionNumber: string | undefined
  questionsValue: string | undefined
  replyValue: string | undefined
  userId: number | undefined
}

export class WorkInfo {
  city: string | undefined
  companyName: string | undefined
  endTime: string | undefined
  jobDescribe: string | undefined
  jobPosition: string | undefined
  jobType: number | undefined
  resumeId: number | undefined
  resumeJobId: number | undefined
  startTime: string | undefined
}

export class ReviewInfo {
  contactAddress: string | undefined
  deliveryId: number | undefined
  highestDegree: string | undefined
  hukouType: string | undefined
  idCard: string | undefined
  interviewProblemList: Array<QuestionInfo> | undefined
  maritalStatus: string | undefined
  phoneNumber: string | undefined
  resumeId: number | undefined
  userId: number | undefined
  userImg: string | undefined
  userOssImg: string | undefined
  userName: string | undefined
  workExperienceList: Array<WorkInfo> | undefined
  resumeState: string | undefined
}
