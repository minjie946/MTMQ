/**
 * @authors minjie
 * @date    2019/10/11
 * @version 1.0.0 firstVersion
 * @module Modal
 * @description 封装基础的模态弹窗
 * @copyright minjie<15181482629@163.com>
 */

import * as React from 'react'
import RootComponent from '@components/root'
import { Modal } from 'antd'
import './index.styl'

interface BasicModalProps {
  title?: string | any
  onCancel?: Function
  visible: boolean
}

interface BasicModalState {
}

export default class BasicModal extends RootComponent<BasicModalProps, BasicModalState> {
  constructor (props:any) {
    super(props)
  }

  /* 模态框的 关闭 */
  handleCancel = () => {
    const { onCancel } = this.props
    if (onCancel) onCancel(0)
  }

  render () {
    const { children, title, visible } = this.props
    let ch:[] = children as any
    let lastIndex = 0
    if (children) lastIndex = ch.length
    return (
      <Modal
        title={(<p className="basic-modal-title">{title}</p>)}
        centered={true}
        footer={false}
        visible={visible}
        onOk={this.handleCancel}
        width={380}
        onCancel={this.handleCancel}
      >
        {children ? ch.slice(0, lastIndex - 1) : null}
        {children ? <div className="basic-modal">
          {ch[lastIndex - 1]}
        </div> : null}
      </Modal>
    )
  }
}
