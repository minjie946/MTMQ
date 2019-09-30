/**
 * @description 已入职人员-电子合同历史记录
 * @author minjie
 * @createTime 2019/08/20
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal, TableItem } from '@components/index'
import { Modal, Row, Button, Col } from 'antd'
import moment from 'moment'

interface SigninHistroyProps {
  visible: boolean
  onCancel?: Function
  userId?: number
  name?: string
  phone?: string
}

interface SigninHistroyState {
  visibleModal: boolean
  errorMsg: string
}

export default class SigninHistroy extends RootComponent<SigninHistroyProps, SigninHistroyState> {
  constructor (props:SigninHistroyProps) {
    super(props)
    this.state = {
      visibleModal: false,
      errorMsg: ''
    }
  }

  componentDidMount () {
    let { userId } = this.props
    if (userId) {
    }
  }

  componentDidUpdate (prevProps:any) {
    let { userId } = this.props
    if (userId && userId !== prevProps.userId) {
    }
  }

  /** 当前窗口的 开关 */
  handleModel = () => {
    const { onCancel } = this.props
    if (onCancel) onCancel(false)
  }

  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const { visible, name, phone } = this.props
    const { visibleModal, errorMsg } = this.state
    const propsModal = {
      title: '查看所有',
      centered: true,
      onCancel: this.handleModel,
      footer: false,
      visible: visible
    }
    const columnData = [
      {
        title: '签到时间',
        dataIndex: 'createUserName',
        key: 'createUserName',
        render: (text:string) => {
          return text ? moment(text).format('YYYY-MM-DD HH:mm') : '---'
        }
      },
      { title: '地点', dataIndex: 'createUserPhone', key: 'createUserPhone' },
      { title: '手机型号', dataIndex: 'contractType', key: 'contractType' }
    ]
    return (
      <Modal width={800} {...propsModal}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ marginRight: 6 }}>账号：{name}</span>
          <span>手机号：{phone}</span>
        </div>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="nfuId"
          URL={this.api.signinQuery}
          searchParams={{}}
          columns={columnData}
        />
        <Row type="flex" justify="end"><Col span={3}><Button>返回</Button></Col></Row>
        <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          <Row className='cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModal>
      </Modal>
    )
  }
}
