/**
 * @author maqian
 * @createTime 2019/07/12
 * @description 晋升通道
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  activityQuery: { // 分页查询充值历史记录
    path: 'nebula/remaining/{projectName}/queryRechargeInfo/{version}'
  },
  activityImport: { // 批量请求导入话费充值
    type: 'get',
    path: 'nebula/remaining/{projectName}/importRechargeExcel/{version}'
  },
  activityDowload: { // 话费充值模板下载(后台/周宁)
    type: 'get',
    path: 'nebula/remaining/{projectName}/exportRechargeExcel/{version}'
  },
  activityAdd: { // 发起单次话费充值请求
    path: 'nebula/remaining/{projectName}/singlePhoneRecharge/{version}'
  },
  activityHistory: { // 查询充值历史数据
    path: 'nebula/remaining/{projectName}/queryRechargeData/{version}'
  }
}
