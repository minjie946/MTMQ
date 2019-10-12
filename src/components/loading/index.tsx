/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module axios
 * @description 路由加载时的组件
 * @copyright minjie<15181482629@163.com>
 */

import * as React from 'react'
import { Spin, Button } from 'antd'
import { LoadingComponentProps } from 'react-loadable'
import './index.styl'

const loading = (props:LoadingComponentProps) => {
  /** 重新加载 */
  function onReload () {
    window.location.reload()
  }
  const { error, timedOut, pastDelay, isLoading } = props
  if (error) {
    return (
      <div className="loading-content">
        <Button className="loading-btn" size="small" onClick={onReload}>重新加载</Button>
      </div>
    )
  } else if (timedOut) {
    return (
      <div className="loading-content">
        <Button className="loading-btn" size="small" onClick={onReload}>重新加载</Button>
      </div>
    )
  } else if (pastDelay || isLoading) {
    return (
      <div className="loading-content">
        <Spin size="large" className="loading-spin" tip="加载中......"/>
      </div>
    )
  } else {
    return null
  }
}
export default loading
