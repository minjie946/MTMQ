/**
 * @description 简历审核-发送offer
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, DatePicker, Row, Button, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ValidateUtil } from '@utils/index'
import moment from 'moment'

const layoutFrom = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 }
}

interface OfferProps extends FormComponentProps {
  deliveryId?:number
  visible: boolean
  onCancel?: Function
}

interface OfferState {
  // 错误消息
  errorMsg:string
  disableBtn: boolean
  visibleModal: boolean
}

class Offer extends RootComponent<OfferProps, OfferState> {
  constructor (props:OfferProps) {
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

  /** 提交信息 */
  handalSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFields((err:any, values:any) => {
      if (!err) {
        this.setState({ disableBtn: true })
        values['deliveryId'] = this.props.deliveryId
        values['reportTime'] = values['reportTime'].format('YYYY-MM-DD')
        this.axios.request(this.api.reviewOffer, values).then((res:any) => {
          this.setState({ disableBtn: false })
          this.$message.success('发送Offer成功！')
          this.handleModel(true) // 关闭，之后记得刷新
        }).catch((err:any) => {
          const { msg } = err
          this.setState({ errorMsg: msg || err, disableBtn: false })
          this.handleBasicModal(1)
        })
      }
    })
  }

  /** 禁用之前的时间 */
  disabledDate = (current:any) => {
    return current && current < moment().startOf('day')
  }

  /** 当前窗口的 开关 */
  handleModel = (flag:boolean) => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.props.form.resetFields()
    if (onCancel) onCancel(false, flag)
  }

  render () {
    const { errorMsg, visibleModal } = this.state
    const { form, visible } = this.props
    const { getFieldDecorator } = form
    const propsModal = {
      title: '发送Offer',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, false),
      footer: false,
      visible: visible
    }
    return (
      <Modal width={432} {...propsModal}>
        <Form onSubmit={this.handalSubmit} {...layoutFrom}>
          <Form.Item label='姓名'>
            {getFieldDecorator('userName', {
              rules: [{ required: true, validator: ValidateUtil.validateName }],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input allowClear placeholder='请输入姓名' />
            )}
          </Form.Item>
          <Form.Item label='薪资'>
            {getFieldDecorator('salary', {
              rules: [{ required: true, validator: ValidateUtil.validateSalary }],
              getValueFromEvent: ValidateUtil.getValueFromEventNumber
            })(
              <Input allowClear maxLength={6} placeholder='请输入薪资' />
            )}
          </Form.Item>
          <Form.Item label='报到时间'>
            {getFieldDecorator('reportTime', {
              rules: [{ required: true, message: '请选择报到时间' }]
            })(
              <DatePicker className='cus-input' disabledDate={this.disabledDate} allowClear placeholder='请选择报到时间' />
            )}
          </Form.Item>
          <Form.Item label='报到地点'>
            {getFieldDecorator('reportPlace', {
              rules: [{ required: true, message: '请输入报到地点' }]
            })(
              <Input allowClear maxLength={30} placeholder='请输入报到地点' />
            )}
          </Form.Item>
          <Form.Item className='btn-inline-group' wrapperCol={{ span: 16, offset: 8 }}>
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

export default Form.create<OfferProps>()(Offer)
