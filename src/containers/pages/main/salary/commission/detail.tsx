/**
 * @description 佣金查看审批
 * @author minjie
 * @createTime 2019/7/5
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Button, Row, Col, Table, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum } from '@utils/index'
import moment from 'moment'

import './style/detail.styl'

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}

interface DetailProps extends FormComponentProps {
  deliveryId: number
  type: 'detail' | 'Approval'
  visible: boolean
  onCancel?: Function
}

interface DetailState {
  // 错误消息
  errorMsg: string
  commissionInfo: any
  // 按钮的禁用
  disableBtn: boolean
  // 保存派送的期限
  deliveryMoneyIdAry: Array<number>
  visibleModal: boolean
}

class Detail extends RootComponent<DetailProps, DetailState> {
  private handleModalKey:number = 0

  constructor (props:DetailProps) {
    super(props)
    this.state = {
      errorMsg: '',
      commissionInfo: {},
      disableBtn: false,
      deliveryMoneyIdAry: [],
      visibleModal: false
    }
  }

  /** 初始加载数据 */
  componentDidUpdate (prevProps:any) {
    const { deliveryId } = this.props
    if (deliveryId !== prevProps.deliveryId && deliveryId !== -1) {
      this.getDetail(deliveryId)
    }
  }

  /** 获取用户的信息 */
  getDetail = (deliveryId:any) => {
    this.axios.request(this.api.commissionDetail, { deliveryId, userId: SysUtil.getLocalStorage(globalEnum.userID) }).then((res:any) => {
      this.setState({ commissionInfo: res.data || {} })
      this.calculationOk()
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err, disableBtn: false })
      this.handleBasicModal(1)
      // this.$message.error(err.msg || err)
      // this.handleModel(3)
    })
  }

  /** 离职之前 */
  quitUserAfter = () => {
    this.setState({ errorMsg: `确定将关闭？` })
    this.handleModalKey = 3
    this.handleBasicModal(1)
  }

  /** 离职 */
  quitUser = () => {
    const { deliveryId } = this.props
    this.setState({ disableBtn: true })
    this.axios.request(this.api.commissionQuit, {
      deliveryId
    }).then((res:any) => {
      this.setState({ disableBtn: false })
      this.$message.success('已关闭！')
      this.handleModel() // 关闭，之后记得刷新
    }).catch((err:any) => {
      this.setState({ disableBtn: false })
      this.setState({ errorMsg: err.msg || err })
      this.handleModalKey = 0
      this.handleBasicModal(1)
    })
  }

  /** 错误的弹框 num: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    if (num === 2) { // 派发
      this.distribute()
    } else if (num === 3) { // 假离职
      this.quitUser()
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 佣金派发之前 */
  distributeAfter = () => {
    this.setState({ errorMsg: `确认派发佣金？` })
    this.handleModalKey = 2
    this.handleBasicModal(1)
  }

  /** 佣金派发 */
  distribute = () => {
    const { commissionInfo, deliveryMoneyIdAry } = this.state
    const { deliveryId, moneyList } = commissionInfo
    const { all, request } = this.axios
    // 根据判断进行派发
    let requestAry:any = []
    deliveryMoneyIdAry.forEach((deliveryMoneyId:number) => {
      requestAry.push(request(this.api.commissionHairBrokerage, {
        deliveryId,
        deliveryMoneyId,
        userId: SysUtil.getLocalStorage(globalEnum.userID)
      }))
    })
    this.setState({ disableBtn: true })
    all(requestAry).then((res:any) => {
      this.setState({ disableBtn: false })
      this.$message.success('派发成功！')
      this.handleModel() // 关闭，之后记得刷新
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err, disableBtn: false })
      this.handleModalKey = 0
      this.handleBasicModal(1)
    })
  }

  /** 计算完成的天数 */
  calculationDay = (entryTime:string) => {
    if (entryTime) {
      let timeDifference = new Date().getTime() - new Date(entryTime).getTime()
      let overTime = Number(timeDifference / 1000 / 60 / 60 / 24)
      return parseInt(overTime + '')
    }
    return 0
  }

  /** 计算完成期限 */
  calculationOk = () => {
    const { entryTime, moneyList } = this.state.commissionInfo
    let day = this.calculationDay(entryTime)
    let deliveryMoneyIdAry:number[] = []
    moneyList.forEach((el:any) => {
      const { deadline, sendOut, deliveryMoneyId } = el
      if (day >= deadline && sendOut === '未派发') {
        deliveryMoneyIdAry.push(deliveryMoneyId)
      }
    })
    this.setState({ deliveryMoneyIdAry })
  }

  /** 当前窗口的 开关 */
  handleModel = () => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.setState(() => {})
    if (onCancel) onCancel(false)
  }

  render () {
    const { errorMsg, commissionInfo, disableBtn, deliveryMoneyIdAry, visibleModal } = this.state
    const { visible, type } = this.props
    const propsModal = {
      title: type === 'Approval' ? '审批' : '查看',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel,
      footer: false,
      visible: visible
    }
    const { commissionUserName, deliveryTime, entryTime, moneyList,
      moneyStatus, orderStatus, organize, phoneNumber, postName, quitTime } = commissionInfo
    let align:'center' = 'center'
    const columns = [
      {
        title: ' ',
        align: align,
        dataIndex: 'number',
        key: 'number',
        render: (text:number) => {
          if (text === 1) {
            return (<span>一期</span>)
          } else if (text === 2) {
            return (<span>二期</span>)
          } else if (text === 3) {
            return (<span>三期</span>)
          } else if (text === 4) {
            return (<span>四期</span>)
          } else if (text === 5) {
            return (<span>五期</span>)
          } else if (text === 6) {
            return (<span>六期</span>)
          }
        }
      },
      {
        title: '提佣期限',
        align: align,
        dataIndex: 'deadline',
        key: 'deadline',
        render: (text:number) => {
          return (<span>{text} 天</span>)
        }
      },
      { title: '佣金金额', align: align, dataIndex: 'brokerage', key: 'brokerage' },
      { title: '佣金状态', align: align, dataIndex: 'sendOut', key: 'sendOut' }
    ]
    let data = []
    if (moneyList && moneyList.length > 0) {
      data = moneyList.filter((el:any) => {
        if (el.deadline !== 0 && el.brokerage !== 0) {
          return el
        }
      })
    }
    return (
      <Modal width={600} {...propsModal}>
        <Form layout="inline" {...formItemLayout}>
          <Row>
            <Col span={24}>
              <Form.Item label="岗位名称" className='cus-from-item'>
                <span className='commission-detail'>{postName || '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="隶属架构" className='cus-from-item'>
                <span className='commission-detail'>{organize || '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="创建时间" className='cus-from-item'>
                <span className='commission-detail'>{deliveryTime ? moment(deliveryTime).format('YYYY-MM-DD HH:mm') : '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="入职时间" className='cus-from-item'>
                <span className='commission-detail'>{entryTime ? moment(entryTime).format('YYYY-MM-DD') : '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="提佣人" className='cus-from-item'>
                <span className='commission-detail'>{commissionUserName || '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="提佣人手机号" className='cus-from-item'>
                <span className='commission-detail'>{phoneNumber || '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="订单状态" className='cus-from-item'>
                <span className='commission-detail'>{orderStatus || '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="佣金状态" className='cus-from-item'>
                <span className='commission-detail'>{moneyStatus || '---'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="佣金详情" wrapperCol={{ span: 18 }} className='cus-from-item'>
                <Table className='commission-detail' rowKey='number' pagination={false} columns={columns} dataSource={data}>
                </Table>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="已完成期限" className='cus-from-item'>
                <span className='commission-detail'>{this.calculationDay(entryTime)} 天{quitTime && '(已关闭)'}</span>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item wrapperCol={{ span: 15, offset: 9 }} className='cus-from-item btn-inline-group'>
                {type === 'Approval' && deliveryMoneyIdAry.length > 0 && <Button type="primary" disabled={disableBtn} onClick={this.distributeAfter}>确认派发</Button>}
                {type === 'Approval' && !quitTime && <Button onClick={this.quitUserAfter}>关闭</Button>}
                <Button onClick={this.handleModel.bind(this, 0)}>返回</Button>
              </Form.Item>
            </Col>
          </Row>
          <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
            <div className="model-error">
              <p>{errorMsg}</p>
            </div>
            {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
              <Button onClick={this.handleBasicModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
              <Button onClick={this.handleBasicModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
              <Button onClick={this.handleBasicModal.bind(this, 0)}>取消</Button>
            </Row>}
          </BasicModal>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<DetailProps>()(Detail)
