/**
 * @author minjie
 * @createTime 2019/08/05
 * @description 消息推送
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  messagePushQuery: { // 分页查询推送消息列表-(后台/周宁)
    path: '/nebula/PushMessage/{projectName}/queryPushMessageList/{version}'
  },
  messagePushDetail: { // 查看推送消息详情-(后台/周宁)
    type: 'get',
    path: '/nebula/PushMessage/{projectName}/getPushMessageDetail/{version}'
  },
  messagePushAdd: { // 新建推送消息-(后台/周宁)
    path: '/nebula/PushMessage/{projectName}/addMessageForPush/{version}'
  },
  messagePush: { // 手动推送消息给所有设备
    type: 'get',
    path: '/nebula/PushMessage/{projectName}/pushMessageToAll/{version}'
  },
  messagePushUpdate: { // 修改推送消息-(后台/周宁)
    path: '/nebula/PushMessage/{projectName}/modifyPushMessage/{version}'
  },
  messagePushHistory: { // 查询推送记录详情-(后台/周宁)
    path: '/nebula/PushMessage/{projectName}/queryPushRecordDetail/{version}'
  }
}
