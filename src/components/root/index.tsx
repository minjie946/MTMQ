/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module root
 * @description 通用的组件，所有的继承, 将界面上需要用到的组件都放在了这，之后进行继承使用
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { message, Modal } from 'antd'
import { HFWAxios, UserAxios } from '@components/axios/Instance'
import { SysUtil, globalEnum } from '@utils/index'
import server from '@server/index'

export default class RootComponent<P = {}, S = {}> extends React.Component<P, S> {
  $message = message // 消息组件
  error = error // model 弹出框的Error
  warning = warning // model 弹出框的Waring
  isAuthenticated = isAuthenticated // 权限的判断
  axios = HFWAxios
  axiosu = UserAxios
  api = server
}

/**
 * 判断权限
 * @param code 权限的code
 */
export function isAuthenticated (code: string): boolean {
  const auth = SysUtil.getLocalStorage(globalEnum.auth)
  return auth && auth.indexOf(code) >= 0
}

/**
 * 错误的输出等
 * @param msg   输出的消息
 * @param title 标题
 */
function error (msg:any, title?:string) {
  Modal.error({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise((resolve, reject) => (resolve()))
    }
  })
}
function warning (msg:any, title?:string) {
  Modal.warning({
    title: title || '消息提示',
    centered: true,
    content: msg,
    onOk () {
      return new Promise((resolve, reject) => (resolve()))
    }
  })
}
