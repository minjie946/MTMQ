/**
 * @description 简历审核-发送面试邀请
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, DatePicker, Row, Button, Modal, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum, ValidateUtil } from '@utils/index'
import moment from 'moment'

const layoutFrom = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

interface InterviewProps extends FormComponentProps {
  deliveryId?:number
  visible: boolean
  onCancel?: Function
}

interface InterviewState {
  // 错误消息
  errorMsg:string
  disableBtn: boolean
  visibleModal: boolean
}

class Interview extends RootComponent<InterviewProps, InterviewState> {
  constructor (props:InterviewProps) {
    super(props)
    this.state = {
      errorMsg: '',
      disableBtn: false,
      visibleModal: false
    }
  }
  /** 错误的谭弹框的显示 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 禁用之前的时间 */
  disabledDate = (current:any) => {
    return current && current < moment().startOf('day')
  }

  /** 提交信息 */
  handalSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFields((err:any, values:any) => {
      if (!err) {
        this.setState({ disableBtn: true })
        values['deliveryId'] = this.props.deliveryId
        values['inviterId'] = SysUtil.getLocalStorage(globalEnum.userID)
        values['invitationTime'] = values['invitationTime'].format('YYYY-MM-DD HH:mm')
        this.axios.request(this.api.reviewInterview, values).then((res:any) => {
          this.setState({ disableBtn: false })
          this.$message.success('发送面试邀请成功！')
          this.handleModel(true) // 关闭，之后记得刷新
        }).catch((err:any) => {
          const { msg } = err
          this.setState({ errorMsg: msg || err, disableBtn: false })
          this.handleBasicModal(1)
        })
      }
    })
  }

  /** 当前窗口的 开关 */
  handleModel = (flag:boolean) => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.props.form.resetFields()
    if (onCancel) onCancel(false, flag)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { errorMsg, visibleModal } = this.state
    const { visible } = this.props
    const propsModal = {
      title: '发送面试通知',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, false),
      footer: false,
      visible: visible
    }
    const { phoneNumber, userName, userNickname } = SysUtil.getLocalStorage(globalEnum.admin) || {
      phoneNumber: undefined,
      userName: undefined,
      userNickname: undefined
    }
    return (
      <Modal width={700} {...propsModal}>
        <Form onSubmit={this.handalSubmit} {...layoutFrom}>
          <Row>
            <Col span={12}>
              <Form.Item label='面试时间'>
                {getFieldDecorator('invitationTime', {
                  rules: [{ required: true, message: '请选择面试时间' }]
                })(
                  <DatePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm"
                    className='cus-input' disabledDate={this.disabledDate}
                    allowClear placeholder='请选择面试时间' />
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='面试地点'>
                {getFieldDecorator('invitationAddress', {
                  rules: [{ required: true, message: '请输入面试地点' }]
                })(
                  <Input allowClear maxLength={30} placeholder='请输入面试地点' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='联系人'>
                {getFieldDecorator('inviteUserName', {
                  initialValue: userName || userNickname || undefined,
                  rules: [
                    { required: true, validator: ValidateUtil.validateName }
                  ],
                  getValueFromEvent: ValidateUtil.getValueFromEventName
                })(
                  <Input type="text" maxLength={30} allowClear placeholder="请输入联系人姓名"></Input>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='联系人电话'>
                {getFieldDecorator('inviteUserPhone', {
                  initialValue: phoneNumber || undefined,
                  rules: [
                    { required: true, validator: ValidateUtil.validatePhone }
                  ],
                  getValueFromEvent: ValidateUtil.getValueFromEventPhone
                })(
                  <Input type="text" minLength={5} maxLength={11} allowClear placeholder="请输入联系人电话"></Input>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className='btn-inline-group' wrapperCol={{ span: 8, offset: 10 }}>
            <Button type='primary' htmlType='submit'>发送</Button>
            <Button onClick={this.handleModel.bind(this, false)}>取消</Button>
          </Form.Item>
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

export default Form.create<InterviewProps>()(Interview)
