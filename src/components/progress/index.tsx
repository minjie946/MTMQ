/**
 * @author minjie
 * @createTime 2019/09/06
 * @description 进度条
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import './index.styl'

interface ProgressParams {
  value: number
  title: string
}

interface ProgressProps {
  total?: number // 总的比例
  percent?: number // 所占的百分比
  successPercent?: Array<ProgressParams> // 分段所占的百分比
}

interface ProgressState {
}

export default class Progress extends RootComponent<ProgressProps, ProgressState> {
  constructor (props:ProgressProps) {
    super(props)
  }
  render () {
    const { successPercent } = this.props
    const classAry = ['progress-bar-wathet', 'progress-bar-warning', 'progress-bar-danger', 'progress-bar-info', 'progress-bar-success', 'progress-bar-violet']
    return (
      <div className="progress-content">
        <div className="progress">
          {successPercent && successPercent.map((el:ProgressParams, index: number) => (
            <div key={index} className={`progress-bar ${classAry[index]}`} style={{ width: `${el.value}%` }}/>
          ))}
        </div>
        <div className="progress-text">
          {successPercent && successPercent.map((el:ProgressParams, index: number) => (
            el.value !== 0 && <div key={index} className="progress-bar">
              <span className={`progress-bar-span ${classAry[index]}`}></span>{el.title}
            </div>
          ))}
        </div>
      </div>
    )
  }
}
