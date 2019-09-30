/**
 * @author maqian
 * @createTime 2019/07/12
 * @description 预支设置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  advanceQuery: { // 分页模糊搜索获取岗位管理信息
    path: 'fury/postManage/{projectName}/queryManagement/{version}'
  },
  advanceDetail: { // 查看佣金详情----实现(周字健)
    type: 'get',
    path: 'natasha/Partner/{projectName}/getRecommendOrder/{version}'
  }
}
