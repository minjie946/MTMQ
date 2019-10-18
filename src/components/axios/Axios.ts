/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module axios
 * @description axios 的请求
 * @copyright minjie<15181482629@163.com>
 */
'use strict'
import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse, Method } from 'axios'

export { AxiosRequestConfig } from 'axios'

export enum HttpsReaponseEnum {
  /** 请求成功 */
  CODE_SUCCESS = 200,
  /** 1、语义有误，当前请求无法被服务器理解。除非进行修改，否则客户端不应该重复提交这个请求。 2、请求参数有误 */
  CODE_PARAMS_ERROR = 400,
  /** 当前请求需要用户验证 */
  CODE_UNAUTHORIZED = 401,
  /** 服务器已经理解请求，但是拒绝执行它 */
  CODE_FORBIDDEN = 403,
  /** 请求失败，请求所希望得到的资源未被在服务器上发现 */
  CODE_NOT_FOUND = 404,
  /** 请求行中指定的请求方法不能被用于请求相应的资源 */
  CODE_METHOD_NOT_ALLOWED = 405,
  /** 服务器遇到了一个未曾预料的状况，导致了它无法完成对请求的处理 */
  CODE_INTERNAL_SERVER_ERROE = 500,
  /** 由于临时的服务器维护或者过载，服务器当前无法处理请求。 */
  CODE_SERVICE_UNAVAILABLE = 503,
  /** 作为网关或者代理工作的服务器尝试执行请求时，未能及时从上游服务器（URI标识出的服务器，例如HTTP、FTP、LDAP）或者辅助服务器（例如DNS）收到响应。 */
  CODE_GATEWAY_TIMEOUT = 504
}

/**
 * url 的格式限制
 * @description type?: Method
  path: string
 */
export interface URLInterface {
  type?: Method
  path: string
  [key:string]: any
}

export interface AxiosInterface {
  /**
   * 自定义的请求
   * @param url     请求的地址
   * @param params  请求参数(非必传)
   * @param options 请求的配置(非必传)
   */
  request<T = any, R = AxiosResponse<T>>(url: URLInterface, params?: Object, options?: AxiosRequestConfig):Promise<R>
  /**
   * 发送多个请求
   */
  all<T>(values: (T | Promise<T>)[]): Promise<T[]>
}

export default class Axios implements AxiosInterface {
  constructor (baseURL: string, timeout: number, headers?:any) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.headers = headers
    this.instance = this.create()
  }
  private instance: AxiosInstance
  private baseURL: string
  private timeout: number
  public headers: any

  /** 原生的值 */
  public axios: any = axios

  private create () {
    const axiosN = axios.create({
      baseURL: this.baseURL,
      timeout: this.timeout
    })
    axiosN.interceptors.request.use((config: any) => {
      config.headers = this.headers
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

  all = axios.all

  request (url: URLInterface, params?: Object, options?: AxiosRequestConfig): Promise<any> {
    const { type, path } = url
    let axisoResponse:any
    switch (type) {
      case 'get':
      case 'GET':
        axisoResponse = this.instance({ url: path, method: 'GET', params, ...options }); break
      default: axisoResponse = this.instance({ url: path, method: 'POST', data: params, ...options }); break
    }
    return axisoResponse
  }
}
