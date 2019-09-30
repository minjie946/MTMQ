/**
 * @author minjie
 * @createTime 2019/06/15
 * @description 电子合同 后台接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  contractQuery: { // 分页查看电子合同列表
    path: 'steven/ect/{projectName}/queryArchiveList/{version}'
  },
  contractDetail: { // 查看电子合同详情
    type: 'get',
    path: 'steven/ect/{projectName}/getTemplateDetail/{version}'
  },
  contractRemove: { // 删除合同
    type: 'get',
    path: 'steven/ect/{projectName}/updateTemplateDelete/{version}'
  },
  contractAdd: { // 新增电子合同模板
    path: 'steven/ect/{projectName}/insertTemplate/{version}'
  },
  contractStatus: { // 电子合同上下架
    path: 'steven/ect/{projectName}/updateTemplateStatus/{version}'
  }
}
