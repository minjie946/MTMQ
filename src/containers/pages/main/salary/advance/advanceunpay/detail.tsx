/**
 * @description 预支-未发款-查看审批
 * @author maqian
 * @createTime 2019/07/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { Form, Button, Row, Col, Input, Modal } from 'antd'
import { RootComponent, BasicModal } from '@components/index'
import { SysUtil, globalEnum } from '@utils/index'
import moment from 'moment'

const { TextArea } = Input

const formItemLayout = { labelCol: { span: 8 }, wrapperCol: { span: 16 } }

interface UnpayDetailProps extends FormComponentProps {
  deliveryId: number
  type: 'detail' | 'Approval'
  visible: boolean
  onCancel?: Function
}

interface UnpayDetailState {
  // 错误消息
  errorMsg: string
  commissionInfo: any
  // 按钮的禁用
  disableBtn: boolean
  visibleModal: boolean
}

class UnpayDetail extends RootComponent<UnpayDetailProps, UnpayDetailState> {
  constructor (props:UnpayDetailProps) {
    super(props)
    this.state = {
      errorMsg: '',
      commissionInfo: {},
      disableBtn: false,
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

  /** 获取详情信息 */
  getDetail = (deliveryId:any) => {
    this.axios.request(this.api.commissionDetail, { deliveryId, userId: SysUtil.getLocalStorage(globalEnum.userID) }).then((res:any) => {
      this.setState({ commissionInfo: res.data || {} })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 审核通过 */
  handlePass = (e:any) => {
    e.preventDefault()
    this.handleModel() // 关闭，之后记得刷新
    // this.axios.request(this.api.commissionHairBrokerage, {
    // }).then((res:any) => {
    //   this.handleModel() // 关闭，之后记得刷新
    // }).catch((err:any) => {
    //   const { msg } = err
    //   this.setState({ errorMsg: msg || err, disableBtn: false })
    //   this.handleBasicModal(1)
    // })
  }
  /** 审核驳回 */
  handleRuturn = (e:any) => {
    e.preventDefault()
    console.log(this.props.form.getFieldsValue())
    // this.axios.request(this.api.commissionHairBrokerage, {
    // }).then((res:any) => {
    //   this.handleModel() // 关闭，之后记得刷新
    // }).catch((err:any) => {
    //   const { msg } = err
    //   this.setState({ errorMsg: msg || err, disableBtn: false })
    //   this.handleBasicModal(1)
    // })
  }

  /** 当前窗口的 开关 */
  handleModel = () => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.props.form.resetFields()
    if (onCancel) onCancel(false)
  }
  render () {
    const { errorMsg, commissionInfo, disableBtn, visibleModal } = this.state
    const { commissionUserId, commissionUserName, deliveryId, deliveryTime,
      entryTime, moneyList, moneyStatus, orderStatus, organize, phoneNumber,
      postName } = commissionInfo
    const { visible, form, type } = this.props
    const { getFieldDecorator } = form
    const propsModal = {
      title: type === 'Approval' ? '审批' : '查看',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel,
      footer: false,
      visible: visible
    }
    return (
      <Modal width={600} {...propsModal}>
        <Form layout="inline" {...formItemLayout}>
          <Row>
            <Col span={12}>
              <Form.Item label="员工姓名" className='cus-from-item'>{postName || '---'}</Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="手机号" className='cus-from-item'>{postName || '---'}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="所属部门" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className='cus-from-item'>{organize || '---'}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="岗位名称" className='cus-from-item'>{deliveryTime ? moment(deliveryTime).format('YYYY-MM-DD HH:mm') : '---'}</Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="申请金额" className='cus-from-item'>{deliveryTime ? moment(deliveryTime).format('YYYY-MM-DD HH:mm') : '---'}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="申请时间" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className='cus-from-item'>{commissionUserName || '---'}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="视频凭证" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className='cus-from-item'>{phoneNumber || '---'}</Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="申请状态" className='cus-from-item'>{orderStatus || '---'}</Form.Item>
            </Col>
            <Col span={12}>
              <Row>
                <Col span={24}>
                  <Form.Item label="审核人" className='cus-from-item'>{orderStatus || '---'}</Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="审核时间" className='cus-from-item'>{orderStatus || '---'}</Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Form.Item label="审核人" className='cus-from-item'>{orderStatus || '---'}</Form.Item>
                </Col>
                <Col span={24}>
                  <Form.Item label="审核时间" className='cus-from-item'>{orderStatus || '---'}</Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item label="历史借款次数" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className='cus-from-item'>0次</Form.Item>
            </Col>
          </Row>
          {
            type === 'Approval' &&
            <Row>
              <Col span={24}>
                <Form.Item label="驳回理由" labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} className='cus-from-item'>
                  {getFieldDecorator('organize', {
                    initialValue: organize
                  })(
                    <TextArea autosize={{ minRows: 4, maxRows: 5 }} maxLength={200} style={{ width: '90%' }} placeholder='请输入驳回理由'></TextArea >
                  )}
                </Form.Item>
              </Col>
            </Row>
          }
          <Row style={{ textAlign: 'center' }}>
            <Col span={24}>
              <Form.Item wrapperCol={{ span: 24 }} className='cus-from-item btn-inline-group'>
                {type === 'Approval' && <Button type="primary" disabled={disableBtn} onClick={this.handlePass}>审核通过</Button>}
                {type === 'Approval' && <Button type="primary" disabled={disableBtn} onClick={this.handleRuturn}>驳回</Button>}
                <Button onClick={this.handleModel.bind(this, 0)}>返回</Button>
              </Form.Item>
            </Col>
          </Row>
          <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
            <div className="model-error">
              <p>{errorMsg}</p>
            </div>
            <Row className='cus-modal-btn-top'>
              <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
            </Row>
          </BasicModal>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<UnpayDetailProps>()(UnpayDetail)
