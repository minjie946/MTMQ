/**
 * @author minjie
 * @createTime 2019/05/20
 * @description 导出数据
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button } from 'antd'
import moment from 'moment'

interface BasicDowloadProps {
  // 下载的地址对象
  action: any
  // 样式
  className?:string
  // 下载按钮的样式
  type?:any
  fileName?: string
  // 导出的时候的条件
  parmsData?: object
  icon?:string
  // 文件后缀 xlsx  xls
  suffix?: string
  // 下载时间
  loadDate?:any
  size?:string
  // 下载是否带当前时间(为true不带时间)
  isLoadeTime?:boolean
  // 下载成功的
  onCancel?:Function
  /** 导入成功之后的函数 */
  onSuccess?: Function
}

interface BasicDowloadState {
  fileName:string
  suffix: string
  loadDate: any
}

export default class BasicDowload extends RootComponent<BasicDowloadProps, BasicDowloadState> {
  constructor (props:any) {
    super(props)
    const { fileName, suffix, loadDate, isLoadeTime } = this.props
    this.state = {
      fileName: fileName || 'hfw导出文件',
      suffix: suffix || 'xlsx',
      loadDate: loadDate || moment().format('YYYYMMDD')
    }
  }

  /* 点击开始下载 */
  download = () => {
    const { parmsData, action, isLoadeTime, onCancel, onSuccess } = this.props
    const { fileName, suffix, loadDate } = this.state
    this.axios.request(action, parmsData, {
      responseType: 'blob'
    }).then((res:any) => {
      if (!res || res.type === 'application/json') {
        if (onCancel) onCancel()
        this.$message.error('导出失败！')
      } else {
        let blob = new Blob([res], { type: 'application/vnd.ms-excel;charset=utf-8' })
        let url = window.URL.createObjectURL(blob)
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        isLoadeTime
          ? link.setAttribute('download', `${fileName}.${suffix}`)
          : link.setAttribute('download', `${fileName}_${loadDate}.${suffix}`)
        document.body.appendChild(link)
        link.click()
        URL.revokeObjectURL(res)
        if (onSuccess) onSuccess()
      }
    }).catch((err:any) => {
      if (onCancel) onCancel()
      this.$message.error(err.msg || err)
    })
  }

  render () {
    const { className, icon, type, size } = this.props
    return (
      <Button onClick={this.download}
        className={className}
        type={type} icon={icon}>{this.props.children}</Button>
    )
  }
}
