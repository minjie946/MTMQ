/**
 * @author minjie
 * @createTime 2019/06/21
 * @description 意见反馈
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  feedbackQuery: { // 分页查看所有反馈历史列表-实现
    path: 'nebula/FeedbackManage/{projectName}/getWholeFeedbackInfo/{version}'
  },
  feedbackDetail: { // 查看反馈会话详情-实现-管理端
    type: 'get',
    path: 'nebula/FeedbackManage/{projectName}/getFeedbackUntreatedSessionInfo/{version}'
  },
  feedbackUpdate: { // 处理反馈-(后台/周宁)
    path: 'nebula/FeedbackManage/{projectName}/updateFeedbackInfo/{version}'
  },
  feedbackUpdateSession: { // 处理反馈会话-(后台/周宁)
    path: 'nebula/FeedbackManage/{projectName}/updateFeedbackSession/{version}'
  }
}
