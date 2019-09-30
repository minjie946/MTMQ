/**
 * @author minjie
 * @createTime 2019/07/06
 * @description 阿里日志服务
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { HFWAxios as Axios } from '@components/index'
import { ConfigUtil, SysUtil, globalEnum } from '@utils/index'
import moment from 'moment'

class LoggerContent {
  constructor (activity:string, Page:string) {
    this.Activity = activity
    this.Page = Page
    this.Environment = 'web'
    this.Source = process.env.SERVICE_URL
    this.Version = process.env.version || '1.0.0'
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.Userid = userId || '未登录'
    this.Time = moment(new Date()).format('YYYY-MM-DD HH:mm')
  }
  // 环境
  Environment: string // iOS||Anroid||Web||小程序
  // 动作
  Activity: string
  // 版本
  Version: string | undefined
  // 用户
  Userid: string
  // 时间
  Time: string
  // 环境
  Source: string | undefined // dev||test||pre||pro
  // 具体的界面
  Page: string
  [ket:string]:any
}

export default class LoggerUtil {
  static host:string = ''
  static project:string = ''
  static logstore:string = ''

  static createLogObj (params:any) {
    let url = `https://${ConfigUtil.loggerProject}.${ConfigUtil.loggerHost}/logstores/${ConfigUtil.loggerLogstore}/track?APIVersion=0.6.0&__topic__=${ConfigUtil.loggerTopic}`
    Axios.axios.get(url, {
      params: params
    }).then((res:any) => {
      console.log('发送消息成功！')
    })
  }

  /**
   * 日志输出
   */
  static log (page:string, activity:string) {
    if (process.env.NODE_ENV !== 'development') {
      let loggoObj = new LoggerContent(activity, page)
      LoggerUtil.createLogObj(loggoObj)
    }
  }
}
