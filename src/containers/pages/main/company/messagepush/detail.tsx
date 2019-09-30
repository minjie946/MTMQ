/**
 * @description 消息推送
 * @author minjie
 * @createTime 2019/08/06
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { BaseProps } from '@typings/global'
import { Form, Button, Row, Col, Popover, Divider } from 'antd'
import moment from 'moment'

const layoutFrom = {
  labelCol: { span: 2 },
  wrapperCol: { span: 16 }
}

interface MessageDetailProps extends FormComponentProps, BaseProps {
}

interface MessageDetailState {
  // 错误消息
  errorMsg: string
  // 按钮的禁用
  disableBtn: boolean
  messageInfo: any
  pushMessageId: number
  pushMode: number
  informationAry: Array<any>
  visibleModal: boolean
}

class MessageDetail extends RootComponent<MessageDetailProps, MessageDetailState> {
  constructor (props:MessageDetailProps) {
    super(props)
    let { id } = this.props.match.params
    this.state = {
      errorMsg: '',
      disableBtn: false,
      messageInfo: {},
      pushMessageId: id || -1,
      pushMode: 1,
      informationAry: [],
      visibleModal: false
    }
  }

  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0

  componentDidMount () {
    // 获取咨询的详情
    this.getInfomation()
    const { pushMessageId } = this.state
    if (pushMessageId && pushMessageId !== -1) { // 修改
      this.getDetail(pushMessageId)
    }
  }

  /** 获取详情的信息 */
  getDetail = (pushMessageId: number) => {
    this.axios.request(this.api.messagePushDetail, {
      pushMessageId
    }).then((res:any) => {
      const { pushMode } = res.data
      this.setState({ messageInfo: res.data, pushMode })
    }).catch((err:any) => {
      const { msg } = err
      this.$message.error(msg || err)
    })
  }

  /** 查询资讯的信息 */
  getInfomation = () => {
    this.axios.request(this.api.informationQuery, {
      current: 1, // 当前的页
      pageSize: 9999 // 每页显示的条数
    }).then((res:any) => {
      const { data } = res.data
      this.setState({ informationAry: data })
    }).catch((err:any) => {
      const { msg } = err
      this.$message.error(msg || err)
    })
  }

  /** 删除的提示 */
  handleModal = (num:number) => {
    if (num === 2) { // 上架下架
      this.pushMessage()
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 返回上一页 */
  goBack = () => {
    this.props.history.replace('/home/company/messagepush')
  }

  /** 消息推送之前 */
  pushMessageAfter = () => {
    this.setState({ errorMsg: `确认推送（${this.state.messageInfo.pushMessageTitle}）么` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 推送消息 */
  pushMessage = () => {
    const { pushMessageId } = this.state.messageInfo
    this.setState({ disableBtn: true })
    this.axios.request(this.api.messagePush, {
      pushMessageId
    }).then((res:any) => {
      this.$message.success('消息推送成功！')
      this.setState({ disableBtn: false })
    }).catch((err:any) => {
      let { msg } = err
      this.setState({ errorMsg: msg || err, disableBtn: false })
      this.handleModal(1)
    })
  }

  render () {
    const { errorMsg, disableBtn, messageInfo, pushMode, informationAry, visibleModal, pushMessageId } = this.state
    const { pushMessageTitle, pushMessageContent, pushPath } = messageInfo
    const columnData = [
      { title: '标题', width: 120, dataIndex: 'pushDetailsTitle', key: 'pushMessageTitle' },
      { title: '推送数目', width: 120, dataIndex: 'acceptCount', key: 'acceptCount' },
      { title: '被清除的数目', width: 120, dataIndex: 'deletedCount', key: 'deletedCount' },
      { title: '被点击的数目', width: 120, dataIndex: 'openedCount', key: 'openedCount' },
      { title: '达到设备的数目', width: 120, dataIndex: 'receivedCount', key: 'receivedCount' },
      { title: '实际发出的数目', width: 120, dataIndex: 'sentCount', key: 'sentCount' },
      {
        title: '推送内容',
        width: 120,
        dataIndex: 'pushDetailsContent',
        key: 'pushDetailsContent',
        render: (text:string) => {
          return text.length > 10 ? <Popover getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
            placement="topLeft" title={'推送内容'} overlayStyle={{ width: 400 }} content={text}>
            <span>{text.substring(0, 10)}...</span>
          </Popover> : text
        }
      },
      { title: '推送设备', width: 80, dataIndex: 'pushDevice', key: 'pushDevice' },
      {
        title: '推送方式',
        width: 80,
        dataIndex: 'pushMode',
        key: 'pushMode',
        render: (text:any) => {
          return text === 0 ? '资讯' : '外部链接'
        }
      },
      {
        title: '推送路径',
        dataIndex: 'pushPath',
        key: 'pushPath',
        width: 120,
        render: (text:string) => {
          return text.length > 10 ? <Popover getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
            placement="topLeft" title={'推送内容'} overlayStyle={{ width: 400 }} content={text}>
            <span>{text.substring(0, 10)}...</span>
          </Popover> : text
        }
      },
      {
        title: '推送时间',
        width: 160,
        dataIndex: 'pushTime',
        key: 'pushTime',
        render: (text:string) => {
          return moment(text).format('YYYY-MM-DD HH:mm')
        }
      },
      { title: '推送人', width: 80, dataIndex: 'pushUserName', key: 'pushUserName' }
    ]
    return (
      <div className='cus-home-content'>
        <Form {...layoutFrom}>
          <Row>
            <Col span={20}>
              <Form.Item label='推送标题' className='cus-from-item'>
                {pushMessageTitle}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='推送内容' className='cus-from-item' wrapperCol={{ span: 12 }}>
                {pushMessageContent}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='推送链接'>
                {pushMode === 0 && informationAry.length > 0 ? informationAry.find((el:any) => el.infoId === Number(pushPath)).infoTitle : pushPath}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item wrapperCol={{ span: 20, offset: 2 }} className='cus-from-item btn-inline-group'>
                <Button type='primary' onClick={this.pushMessageAfter} disabled={disableBtn}>推送</Button>
                <Button htmlType="button" onClick={this.goBack}>返回</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <Divider orientation='left'>推送历史记录</Divider>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="pushRecordId"
          scroll={{ x: 1240 }}
          URL={this.api.messagePushHistory}
          searchParams={{ pushMessageId }}
          columns={columnData}
        />
        <BasicModal visible={visibleModal} onCancel={this.handleModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
          </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            <Button onClick={this.handleModal.bind(this, 0)}>取消</Button>
          </Row>}
        </BasicModal>
      </div>
    )
  }
}

export default Form.create<MessageDetailProps>()(MessageDetail)
