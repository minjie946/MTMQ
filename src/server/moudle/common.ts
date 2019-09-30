/**
 * @author minjie
 * @createTime 2019/04/08
 * @description Server Api 后台接口: 公共的接口  组织等查询的
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export default {
  login: { // 登录
    path: 'howard/login/{projectName}/darkLogin/{version}'
  },
  loginPwd: { // 手机号+密码登录(app/孙权庆)
    path: 'howard/login/{projectName}/login/{version}'
  },
  newLogin: { // 翟顺辉
    path: '/auth/web/login/{projectName}'
  },
  newSendPhoneCode: { // 发送 登录/找回密码 验证码（后台 // 翟顺辉
    type: 'get',
    path: '/sms/sendCode/web/{projectName}'
  },
  formalSendLoginCode: { // 发送验证码
    path: 'howard/sms/{projectName}/formalSendLoginCode/{version}'
  },
  getUserInfo: { // 获取用户的信息
    type: 'get',
    path: 'howard/staff/{projectName}/backGetUserInfo/{version}'
  },
  commonOrganizeTree: { // 查询组织树--实现
    path: 'howard/organize/{projectName}/getOrganizeTree/{version}'
  },
  ossGetkey: { // 获取osskey
    type: 'get',
    path: 'natasha/sts/{projectName}/getAliBaBaCopyright/{version}'
  },
  getTaskInfo: { // 查看任务进度信息--实现
    type: 'get',
    path: 'james/importTask/{projectName}/getTaskInfo/{version}'
  }
}
