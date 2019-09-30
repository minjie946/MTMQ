/**
 * @author minjie
 * @createTime 2019/07/06
 * @description 配置文件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

interface ConfigInterface {
  axiosBasePath: string
  axiosHeaders: any
  watermark: string
  OSSPrivateBucket: string
  loggerLogstore: string
  userSeverBasePath: string
}

class ConfigUtils {
  constructor () {
    let obj:ConfigInterface = this.init()
    this.axiosBasePath = obj.axiosBasePath
    this.axiosHeaders = obj.axiosHeaders
    this.watermark = obj.watermark
    this.OSSPrivateBucket = obj.OSSPrivateBucket
    this.loggerLogstore = obj.loggerLogstore
    this.userSeverBasePath = obj.userSeverBasePath
    this.powerObj = this.powerSearch()
  }

  /** axios basepath */
  axiosBasePath: string
  /** 请求头 */
  axiosHeaders: any = {}
  /** 普通请求的超时时间 */
  axiosTimeout:number = 9000
  /** 路由请求超时时间 */
  reactRouterTimeout:number = 9000
  /** 用户服务的（翟顺辉） */
  userSeverBasePath: string

  /** 水印 */
  watermark:string

  /** OSS 服务 */
  OSSRegion: string = 'oss-cn-hangzhou'
  OSSPrivateBucket: string

  /** 日志访问host */
  loggerHost:string = 'cn-hangzhou.log.aliyuncs.com'
  /** 日志访问Project */
  loggerProject:string = 'sj56-logs-hfw'
  /** 日志访问Logstore */
  loggerLogstore:string
  /** 日志访问Topic */
  loggerTopic:string = 'hfw'

  /** 初始化组件信息 */
  init ():ConfigInterface {
    switch (process.env.SERVICE_URL) {
      case 'tes':
        return {
          axiosBasePath: 'https://hfwd.sj56.com.cn',
          axiosHeaders: { 'X-Ca-Stage': 'TEST' },
          watermark: '测试',
          OSSPrivateBucket: 'hfw-test-private',
          loggerLogstore: 'hfw-store-tes-track',
          userSeverBasePath: 'https://zct-api.sj56.com.cn/stallone'
        }
      case 'pre':
        return {
          axiosBasePath: 'https://hfwd.sj56.com.cn',
          axiosHeaders: { 'X-Ca-Stage': 'PRE' },
          watermark: '预发',
          OSSPrivateBucket: 'hfw-test-private',
          loggerLogstore: 'hfw-store-pre-track',
          userSeverBasePath: 'https://zct-api.sj56.com.cn/stallone'
        }
      case 'pro':
        return {
          axiosBasePath: 'https://hfws.sj56.com.cn',
          axiosHeaders: {},
          watermark: '',
          OSSPrivateBucket: 'hfw-oss-private',
          loggerLogstore: 'hfw-store-pro-track',
          userSeverBasePath: 'https://hfws.sj56.com.cn/stallone'
        }
      case 'dev':
        return {
          axiosBasePath: 'https://hfwd.sj56.com.cn',
          axiosHeaders: {},
          watermark: '开发',
          OSSPrivateBucket: 'hfw-test-private',
          loggerLogstore: 'hfw-store-ode-track',
          userSeverBasePath: 'https://zct-api.sj56.com.cn/stallone'
        }
      default:
        return {
          axiosBasePath: 'http://hfwd.sj56.com.cn',
          axiosHeaders: {},
          watermark: '开发',
          OSSPrivateBucket: 'hfw-test-private',
          loggerLogstore: 'hfw-store-ode-track',
          userSeverBasePath: 'http://zct-api.sj56.com.cn/stallone'
        }
    }
  }

  /** 权限组 */
  powerObj:any = ''

  powerSearch () {
    let obj:any = {}
    switch (process.env.SERVICE_URL) {
      // 预发环境
      case 'pre':
        obj = {
          'H004003000': [2, 106, 160],
          'H004004000': [2, 106, 160],
          'H004003001': [2, 106, 160],
          'H004003002': [2, 106, 160],
          'H004005000': [2, 106, 160],
          'H001002003': [2, 106, 160],
          'H003001007': [2]
        }
        break
      // 测试环境
      case 'tes':
        obj = {
          'H004003000': [10000064, 108, 229, 72],
          'H004004000': [10000064, 108, 229, 72],
          'H004003001': [10000064, 108, 229, 72],
          'H004003002': [10000064, 108, 229, 72],
          'H004005000': [10000064, 108, 229, 72],
          'H001002003': [10000064, 108, 229, 72],
          'H003001007': [10000064]
        }
        break
      // 生产环境
      case 'pro':
        obj = {
          'H004003000': [10000004, 10000036, 10006349], // 工资
          'H004003001': [10000004, 10000036], // 划账
          'H004003002': [10000004, 10006349], // 导入
          'H004005000': [10000004, 10000014], // 看板
          'H004004000': [10000004, 10000451, 10000289], // 工资单
          'H001002003': [10000004], // 公司主体-公司设置银行账号
          'H003001007': [10000004] // 修改用户手机号
        }
        break
      // 开发环境
      default:
        obj = {
          'H004003000': [10000064],
          'H004004000': [10000064],
          'H004003001': [10000064],
          'H004003002': [10000064],
          'H004005000': [10000064],
          'H001002003': [10000064],
          'H003001007': [10000064]
        }
        break
    }
    return obj
  }
}

export default new ConfigUtils()
