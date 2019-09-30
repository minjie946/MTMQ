/**
 * @author minjie
 * @createTime 2019/09/09
 * @description axios enum
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

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

/** 用户服务需要上传的项目名 */
export enum ProjectEnum {
  /** 早餐 */
  ZC = 'ZC',
  WMS = 'WMS',
  /** 我好运 */
  WHY = 'WHY',
  /** 好饭碗 */
  HFW = 'hfw',
  HRS = 'hrs'
}

/**
 * 对应的请求的地址
 */
export enum AxiosHeaderEnum {
  HFW = 'HFW',
  USER = 'USER',
}
