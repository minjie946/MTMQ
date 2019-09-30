/**
 * @author minjie
 * @createTime 2019/09/07
 * @description axios
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import axios, { AxiosRequestConfig, AxiosInstance } from 'axios'
import { SysUtil, globalEnum, LoggerUtil, JudgeUtil, ConfigUtil } from '@utils/index'
import { createHashHistory } from 'history'
import { ResponseStatusEnum, HttpsReaponseEnum, AxiosHeaderEnum, ProjectEnum } from './AxiosEnum'

interface URLObject {
  path:string
  type?: 'POST' | 'post' | 'GET' | 'get' | string
}

/* response 返回值类型 */
interface Response {
  code: number
  data: any
  msg: Array<string>
  [key: string]: any
}

export default class Axios {
  constructor (basePath: string, timeout: number = 0, headers: AxiosHeaderEnum, projectName?: string) {
    if (projectName) this.projectName = projectName
    this.instace = this.create(basePath, timeout, headers)
  }

  private instace: AxiosInstance

  private projectName: any = null

  public axios:any = axios

  /** 创建新的请求对象 */
  private create = (basePath:string, timeout: number = 0, headers?:AxiosHeaderEnum):AxiosInstance => {
    const axiosN = axios.create({
      baseURL: basePath,
      timeout: timeout
    })
    // 请求拦截
    axiosN.interceptors.request.use((config: any) => {
      switch (headers) {
        case AxiosHeaderEnum.HFW:
          config.headers = {
            token: SysUtil.getLocalStorage(globalEnum.token) || 'ss', // 存在token 则发送token
            traceId: SysUtil.traceId() + '_' + (SysUtil.getLocalStorage(globalEnum.userID) || -1),
            ...ConfigUtil.axiosHeaders
          }
          break
        case AxiosHeaderEnum.USER:
          config.headers = {
            device: 'WebPage',
            platform: 'web',
            traceId: SysUtil.traceId() + '_' + (SysUtil.getLocalStorage(globalEnum.userID) || -1),
            Authorization: SysUtil.getLocalStorage(globalEnum.token) || ''
          }
          break
        default:
          config.headers = {}
          break
      }
      return config
    })
    // 响应 拦截器
    axiosN.interceptors.response.use(
      (response:any) => response,
      (err:any) => {
        return this.responseConfigError(err)
      })
    return axiosN
  }

  /** 请求失败响应的处理 */
  private responseConfigError (err:any) {
    const { response, message } = err
    if (response) {
      const { status, config: { url, method, data, params } } = response
      switch (status) {
        case HttpsReaponseEnum.CODE_PARAMS_ERROR: err.message = `响应状态(status)：${status} 消息(message): 请求参数有误`; break
        case HttpsReaponseEnum.CODE_UNAUTHORIZED: err.message = `响应状态(status)：${status} 消息(message): 当前请求需要用户验证`; break
        case HttpsReaponseEnum.CODE_FORBIDDEN: err.message = `响应状态(status)：${status} 消息(message): 服务器已经理解请求，但是拒绝执行它`; break
        case HttpsReaponseEnum.CODE_NOT_FOUND: err.message = `响应状态(status)：${status} 消息(message): 请求路径不存在`; break
        case HttpsReaponseEnum.CODE_METHOD_NOT_ALLOWED: err.message = `响应状态(status)：${status} 消息(message): 请求行中指定的请求方法不能被用于请求相应的资源`; break
        case HttpsReaponseEnum.CODE_INTERNAL_SERVER_ERROE: err.message = `响应状态(status)：${status} 消息(message): 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理`; break
        case HttpsReaponseEnum.CODE_SERVICE_UNAVAILABLE: err.message = `响应状态(status)：${status} 消息(message): 由于临时的服务器维护或者过载，服务器当前无法处理请求。`; break
        case HttpsReaponseEnum.CODE_GATEWAY_TIMEOUT: err.message = `响应状态(status)：${status} 消息(message): 响应超时`; break
        default: err.message = `响应状态(status)：${status} 消息(message): ${message}`; break
      }
      if (process.env.NODE_ENV === 'development') {
        console.info(`[axios-cus] 响应状态(status)：${status}`)
        console.info(`[axios-cus] url(${method})：${url}`)
        console.info(`[axios-cus] 参数：${method === 'get' ? params : data}`)
        console.info(`[axios-cus] 消息(message)：${message}`)
      }
    } else {
      if (err.message.indexOf('Network') >= 0) {
        err.message = '请求出错了'
      } else if (err.message.indexOf('timeout') >= 0) {
        err.message = '请求超时啦'
      } else if (err.response) {
        const { message } = err.response.data
        if (message) err.message = message
      }
    }
    return Promise.reject(err)
  }

  /** 对URL 进行筛选过滤 */
  private URlFilter = (url:string, projectName?: any, version: string = 'v1'):string => {
    if (projectName) {
      url = url.replace('{projectName}', projectName)
    } else {
      if (url.indexOf('{projectName}')) {
        let project = SysUtil.getLocalStorage(globalEnum.project)
        if (project) {
          if (project.indexOf('物美') >= 0) {
            url = url.replace('{projectName}', 'wm')
          } else if (project.indexOf('盒马') >= 0) {
            url = url.replace('{projectName}', 'hm')
          } else {
            url = url.replace('{projectName}', 'sj')
          }
        } else {
          url = url.replace('{projectName}', 'sj')
        }
      }
    }
    if (url.indexOf('{version}')) url = url.replace('{version}', version)
    return url
  }

  /** 对返回的结果进行处理 */
  private resltData = (obj:any) => {
    return new Promise((resolve, reject) => {
      obj.then((res:any) => {
        const { headers: { authorization }, config: { responseType }, data: { code, data, message, msg, token } } = res // 获取到token
        if (authorization && !JudgeUtil.isEmpty(authorization)) {
          SysUtil.setLocalStorage(globalEnum.token, authorization, 5)
        }
        if (token && !JudgeUtil.isEmpty(token)) {
          SysUtil.setLocalStorage(globalEnum.token, token, 5)
        }
        // 根据不同的响应类型返回不同的
        if (responseType && responseType === 'blob') {
          resolve(res.data)
        } else {
          let a:Response = { code: code, msg: message || msg, data: data }
          switch (code) {
            case ResponseStatusEnum.CODE_200: resolve(a); break
            case ResponseStatusEnum.CODE_400: reject(a); break // 操作失败
            case ResponseStatusEnum.CODE_411: reject(a); break // 参数错误！
            case ResponseStatusEnum.CODE_500: reject(a); break // 服务器错误
            case ResponseStatusEnum.CODE_1002: reject(a); break // 访问太频繁了！
            case ResponseStatusEnum.CODE_4001: reject(a); break // 友情提示
            case ResponseStatusEnum.CODE_ZERO_1000: // token 失效
              LoggerUtil.log('请求的界面', '退出好饭碗后台 token 失效')
              SysUtil.clearLocalStorageAsLoginOut()
              const history = createHashHistory()
              history.replace('/') // 跳转到登录的界面
              break
            default: reject(a); break
          }
        }
      }).catch((err:any) => {
        let a = { msg: err.message }
        reject(a)
      })
    })
  }

  /**
   * 发送请求 get post
   */
  request = (URL:URLObject, params?: any, config?: AxiosRequestConfig) => {
    let { type, path } = URL
    /** 权限判断 */
    if (!JudgeUtil.isEmpty(SysUtil.getLocalStorage(globalEnum.token)) && SysUtil.isAuthExit()) {
      SysUtil.clearLocalStorageAsLoginOut()
      const history = createHashHistory()
      history.replace('/') // 跳转到登录的界面
    }
    path = this.URlFilter(path, this.projectName) // Url 过滤筛选
    let resAxios = null
    switch (type) {
      case 'get':
      case 'GET':
        resAxios = this.instace({ url: path, method: 'get', params: params, ...config }); break
      default: resAxios = this.instace({ url: path, method: 'POST', data: params, ...config }); break
    }
    return this.resltData(resAxios)
  }

  /** 对信息进行修改 */
  all = (requestAry:Array<any>) => {
    return new Promise((resolve, reject) => {
      axios.all(requestAry).then((res:any) => {
        resolve(res)
      }).catch((err:any) => {
        reject(err)
      })
    })
  }
}

export const HFWAxios = new Axios(ConfigUtil.axiosBasePath, ConfigUtil.axiosTimeout, AxiosHeaderEnum.HFW)
export const UserAxios = new Axios(ConfigUtil.userSeverBasePath, ConfigUtil.axiosTimeout, AxiosHeaderEnum.USER, ProjectEnum.HFW)
