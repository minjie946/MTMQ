/**
 * @description 佣金-查看发送的历史记录
 * @author minjie
 * @createTime 2019/08/23
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Form, Input, Select, Row, Col, Button, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

interface EmailHistoryModalProps {
  visible: boolean
  onCancel?: Function
}

interface EmailHistoryModalState {
  serachParam: any
}

export default class EmailHistoryModal extends RootComponent<EmailHistoryModalProps, EmailHistoryModalState> {
  constructor (props:EmailHistoryModalProps) {
    super(props)
    this.state = {
      serachParam: {}
    }
  }

  /** 关闭弹窗 */
  handleModal = () => {
    const { onCancel } = this.props
    if (onCancel) {
      onCancel(false)
    }
  }

  /** 下载附件 */
  dowloadEmailFile = (url:string) => {
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    document.body.appendChild(link)
    link.click()
    this.$message.success('下载成功!')
  }

  render () {
    const { visible } = this.props
    const { serachParam } = this.state
    const propsModal = {
      title: '历史记录',
      centered: true,
      onCancel: this.handleModal,
      footer: false,
      visible: visible
    }
    const columnData = [
      { title: '通知时间', dataIndex: 'creationTime', key: 'creationTime' },
      { title: '通知标题', dataIndex: 'noticeTitle', key: 'noticeTitle' },
      { title: '通知类型', dataIndex: 'noticeType', key: 'noticeType' },
      { title: '通知用户', dataIndex: 'noticeUserName', key: 'noticeUserName' },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          let { fileUrl } = record
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.dowloadEmailFile.bind(this, fileUrl)}>下载附件</span>
            </div>
          )
        }
      }
    ]
    return (
      <Modal width={800} {...propsModal}>
        <div style={{ height: 550 }}>
          <TableItem
            rowSelectionFixed
            rowSelection={false}
            rowKey="preNoticeId"
            URL={this.api.commissionEmlailHistory}
            searchParams={serachParam}
            columns={columnData}
          />
        </div>
      </Modal>
    )
  }
}
