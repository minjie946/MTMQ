/**
 * @description 公司资讯预览
 * @author minjie
 * @createTime 2019/08/26
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Modal } from 'antd'
import 'braft-editor/dist/output.css'
import './previewmodal.styl'

interface PreviewModalProps {
  visible: boolean
  html?:any
  title?: string
  onCancel?: Function
}

interface PreviewModalState {
}

export default class PreviewModal extends RootComponent<PreviewModalProps, PreviewModalState> {
  constructor (props:PreviewModalProps) {
    super(props)
  }

  /** 当前窗口的 开关 */
  handleModal = () => {
    const { onCancel } = this.props
    if (onCancel) onCancel(false)
  }

  render () {
    const { visible, html, title } = this.props
    const propsModal = {
      title: title || '资讯预览',
      centered: true,
      onCancel: this.handleModal,
      footer: false,
      visible: visible
    }
    return (
      <Modal width={460} {...propsModal}>
        <div className="braft-output-content preview-content" dangerouslySetInnerHTML={{ __html: html }}></div>
      </Modal>
    )
  }
}
