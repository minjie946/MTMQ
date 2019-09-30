/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 自定义 全局的 空当显示为 空时
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import zw from '@assets/images/share/empty/zw.png'
import './BasicEmpty.less'

export const customizeRenderEmpty = () => {
  return (
    <div className="empty-content" >
      <img src={zw}></img>
      <p>暂无数据</p>
    </div>
  )
}

export const EmptyTable = () => {
  return (
    <div className="empty-content" style={{ padding: '100px 0' }}>
      <img src={zw}></img>
      <p>暂无数据</p>
    </div>
  )
}
