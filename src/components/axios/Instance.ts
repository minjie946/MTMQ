/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module axios
 * @description axios 进行业务的实现
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
'use strict'

import Axios, { URLInterface, AxiosRequestConfig } from './Axios'
import { createHashHistory } from 'history'
import { SysUtil, globalEnum, JudgeUtil, ConfigUtil } from '@utils/index'

/** 业务的返回的代码 */
export enum ResponseStatusEnum {
  CODE_200 = 200,
  /** 操作失败 */
  CODE_400 = 400,
  /** 参数错误！ */
  CODE_411 = 411,
  /** 服务器错误 */
  CODE_500 = 500,
  /** 访问太频繁了！ */
  CODE_1002 = 1002,
  /** 友情提示 */
  CODE_4001 = 4001,
  /** token 失效 */
  CODE_ZERO_1000 = -1000
}

/** 请求头配置枚举 */
export enum AxiosHeaderEnum {
  HFW = 'HFW',
  USER = 'USER',
}

/** 对应着请求路径中需要替换的项目的名称 */
export enum URLProjectEnum {
  /** 早餐 */
  ZC = 'ZC',
  WMS = 'WMS',
  /** 我好运 */
  WHY = 'WHY',
  /** 好饭碗 */
  HFW = 'hfw',
  HRS = 'hrs',
  OTHER = ''
}

export interface Response {
  code: number
  data: any
  msg: Array<string>
  [key: string]: any
}

class AxiosInstance extends Axios {
  constructor (baseURL: string, timeout: number, headerType:AxiosHeaderEnum = AxiosHeaderEnum.HFW, URLReplace: URLProjectEnum = URLProjectEnum.OTHER) {
    super(baseURL, timeout)
    this.headerType = headerType
    this.URLReplace = URLReplace
  }

  /** 设置请求头的类型 */
  private headerType: AxiosHeaderEnum

  /** 是否需要替换请求路径中的字段 */
  private URLReplace: URLProjectEnum| undefined

  request (url: URLInterface, params: Object, options: AxiosRequestConfig = {}) {
    /** 权限判断 */
    if (!JudgeUtil.isEmpty(SysUtil.getLocalStorage(globalEnum.token)) && SysUtil.isAuthExit()) {
      SysUtil.clearLocalStorageAsLoginOut()
      const history = createHashHistory()
      history.replace('/') // 跳转到登录的界面
    }
    url.path = this.URlFilter(url.path, this.URLReplace)
    let headers:any
    switch (this.headerType) {
      case AxiosHeaderEnum.HFW:
        headers = {
          token: SysUtil.getLocalStorage(globalEnum.token) || 'ss', // 存在token 则发送token
          traceId: SysUtil.traceId() + '_' + (SysUtil.getLocalStorage(globalEnum.userID) || -1),
          ...ConfigUtil.axiosHeaders
        }
        break
      case AxiosHeaderEnum.USER:
        headers = {
          device: 'WebPage',
          platform: 'web',
          traceId: SysUtil.traceId() + '_' + (SysUtil.getLocalStorage(globalEnum.userID) || -1),
          Authorization: SysUtil.getLocalStorage(globalEnum.token) || ''
        }
        break
      default: headers = {}; break
    }
    options = Object.assign(options, {
      headers
    })
    const responseAxiso = super.request(url, params, options)
    return this.resltData(responseAxiso)
  }

  /** 对URL 进行筛选过滤 */
  private URlFilter = (url:string, projectName?: any, version: string = 'v1'):string => {
    if (projectName && projectName !== URLProjectEnum.OTHER) {
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

  /**
   * 对返回的结果进行处理
   */
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
}

export const HFWAxios = new AxiosInstance(ConfigUtil.axiosBasePath, ConfigUtil.axiosTimeout, AxiosHeaderEnum.HFW)
export const UserAxios = new AxiosInstance(ConfigUtil.userSeverBasePath, ConfigUtil.axiosTimeout, AxiosHeaderEnum.USER, URLProjectEnum.HFW)
