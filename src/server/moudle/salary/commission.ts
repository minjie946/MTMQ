/**
 * @author minjie
 * @createTime 2019/06/25
 * @description 佣金设置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  commissionQuery: { // 查看佣金管理列表--分页--实现
    path: 'natasha/Partner/{projectName}/getRecommendOrderList/{version}'
  },
  commissionDetail: { // 查看佣金详情----实现(周字健)
    type: 'get',
    path: 'natasha/Partner/{projectName}/getRecommendOrder/{version}'
  },
  commissionHairBrokerage: { // 佣金发放--实现(周字健)
    type: 'get',
    path: 'natasha/Partner/{projectName}/hairBrokerage/{version}'
  },
  commissionQuit: { // 简历审核-离职-实现
    type: 'get',
    path: 'natasha/Resume/{projectName}/updateOnlineResumeQuit/{version}'
  },
  commissionEmlailHistory: { // 查询历史邮件发送记录-(后台/周宁)
    path: 'howard/Email/{projectName}/queryEmailHistoryRecord/{version}'
  }
}
