/**
 * @author minjie
 * @createTime 2019/06/19
 * @description 电子面试
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  interviewQuery: { // 电子合同--查看模板列表--实现
    path: 'natasha/ElectronInterview/{projectName}/queryDzInterviewList/{version}'
  },
  interviewDetail: { // 电子面试-查看模板详情--实现
    type: 'get',
    path: 'natasha/ElectronInterview/{projectName}/getElectronicsTemplate/{version}'
  },
  interviewAdd: { // 电子面试-新增模板--实现
    path: 'natasha/ElectronInterview/{projectName}/addElectronInterview/{version}'
  },
  interviewUpdate: { // 电子面试-修改模板--实现
    path: 'natasha/ElectronInterview/{projectName}/updateOnlineResumeJob/{version}'
  },
  interviewRemove: { // 电子简历-删除模板--实现
    type: 'get',
    path: 'natasha/ElectronInterview/{projectName}/deleteOnlineResumeJob/{version}'
  },
  interviewQuestion: { // 获取电子面试问题--实现
    type: 'get',
    path: 'natasha/ElectronInterview/{projectName}/getDzInterviewProblemList/{version}'
  },
  interviewSearchPost: { // 搜索岗位的信息
    path: 'natasha/ElectronInterview/{projectName}/getDzInterviewProblemList/{version}'
  },
  interviewInterviewList: { // 查看所有电子面试模板下拉
    type: 'get',
    path: 'natasha/ElectronInterview/{projectName}/getElectronicsInterviewList/{version}'
  }
}
