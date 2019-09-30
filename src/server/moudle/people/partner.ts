/**
 * @author minjie
 * @createTime 2019/07/5
 * @description 合伙人 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  partnerQuery: { // 合伙人信息查询(后台/孙权庆)
    path: 'howard/partner/{projectName}/queryPartnerList/{version}'
  },
  partnerMaybePartner: { // 获取合伙人候选人(后台/孙权庆)
    type: 'get',
    path: 'howard/partner/{projectName}/getMaybePartner/{version}'
  },
  partnerAdd: { // 新建合伙人(后台/孙权庆)
    path: 'howard/partner/{projectName}/insertNewPartner/{version}'
  },
  partnerImport: { // 新建合伙人导入(后台/孙权庆)
    path: 'howard/partner/{projectName}/partnerImport/{version}'
  },
  partnerImportTem: { // 合伙人导入模板下载(后台/孙权庆)
    type: 'get',
    path: 'howard/partner/{projectName}/partnerImportTem/{version}'
  }
}
