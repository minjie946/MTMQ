/**
 * @author minjie
 * @createTime 2019/05/15
 * @description 公司管理的后天接口
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  projectQuery: { // 分页模糊搜索获取项目信息
    path: 'fury/cp/{projectName}/queryProject/{version}'
  },
  projectDetail: { // 根据序列ID查询项目详细信息 (后台)
    type: 'get',
    path: 'fury/cp/{projectName}/getProject/{version}'
  },
  projectAdd: { // 新增项目信息(后台)--实现
    path: 'fury/cp/{projectName}/addProject/{version}'
  },
  projectEdit: { // 修改项目信息(后台)--实现
    path: 'fury/cp/{projectName}/updateProject/{version}'
  },
  projectGetOrganizationAry: { // 获取零级组织数据(后台/孙权庆)
    type: 'get',
    path: 'howard/organize/{projectName}/getZeroOrganizeTree/{version}'
  }
}
