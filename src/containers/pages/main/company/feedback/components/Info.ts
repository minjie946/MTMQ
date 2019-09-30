/**
 * @description 意见反馈
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export class SessionInfo {
  feedbackOrReplyTime: string| undefined // 更新时间
  feedbackSessionContentOrReply: string| undefined // 会话内容
  feedbackSessionId: number| undefined // 会话ID
  feedbackSessionIdentifier: number| undefined // 会话标识符 0:反馈 1:回复
  feedbackSessionType: string| undefined // 反馈会话类型 img:图片 text:文字
}

export class ReplyInfo {
  feedbackContent: string | undefined
  feedbackTime: string | undefined
  feedbackType: string | undefined
  feedbackerName: string | undefined
  feedbackerPhone: string | undefined
  feedbackDevice: string | undefined
  firstPhotoPath: string | undefined
  replyContent: string | undefined
  secondPhotoPath: string | undefined
  sessionList: Array<SessionInfo> | undefined
  thirdPhotoPath: string | undefined
}
