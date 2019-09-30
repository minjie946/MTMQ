/**
 * @author minjie
 * @createTime 2019/06/19
 * @description 简历审核
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  reviewQuery: { // 查看所有投递简历--分页--实现
    path: 'natasha/Resume/{projectName}/getResumeDeliveryList/{version}'
  },
  reviewDetail: { // 在线简历-查看--实现
    type: 'get',
    path: 'natasha/Resume/{projectName}/getOnlineResumeChat/{version}'
  },
  reviewInterview: { // 发送面试邀请 线下面试邀请-实现
    path: 'natasha/Resume/{projectName}/addInterviewInvitation/{version}'
  },
  reviewOffer: { // 发送Offer 投递简历录用--实现
    path: 'natasha/Resume/{projectName}/addResumeEmploy/{version}'
  },
  reviewNo: { // 不合适 投递简历拒绝--实现
    type: 'get',
    path: 'natasha/Resume/{projectName}/updateResumeRefuse/{version}'
  },
  reviewRatio: { // 获取简历占比--实现
    type: 'get',
    path: 'natasha/Resume/{projectName}/getResumeRatio/{version}'
  }
}
