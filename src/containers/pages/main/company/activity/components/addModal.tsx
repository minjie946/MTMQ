/**
 * @description 新增充值记录
 * @author minjie
 * @createTime 2019/08/27
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, Button, Row, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import { ValidateUtil, JudgeUtil } from '@utils/index'

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
}

interface AddModalProps extends FormComponentProps {
  visible: boolean
  onCancel?: Function
}

interface AddModalState {
  errorMsg: string
  visibleModal: boolean
  disabledBtn: boolean
}

class AddModal extends RootComponent<AddModalProps, AddModalState> {
  constructor (props:AddModalProps) {
    super(props)
    this.state = {
      errorMsg: '',
      visibleModal: false,
      disabledBtn: false
    }
  }

  /** 新增 */
  handleSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        this.setState({ disabledBtn: true })
        this.axios.request(this.api.activityAdd, values).then((res:any) => {
          this.setState({ disabledBtn: false })
          this.$message.success('新增成功！')
          this.handleModel() // 关闭，之后记得刷新
        }).catch((err:any) => {
          this.setState({ errorMsg: err.msg || err, disabledBtn: false })
          this.handleBasicModal(1)
        })
      }
    })
  }

  /** 错误的消息提示 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 当前窗口的 开关 */
  handleModel = () => {
    const { onCancel } = this.props
    this.props.form.resetFields()
    if (onCancel) onCancel(false)
  }

  /** 金额校验 */
  validatorRechargeAmount = (rules:any, value:any, callback: Function) => {
    let reg = /^\d+(\.\d{1,2})?$/
    callback()
  }

  /** 限制金额的输入 */
  getValueFromEventAmount = (e:any) => {
    let value = e.target.value
    value.replace(/^\s*/g, '')
      .replace(/[^\d\.]/g, '')
    value = ValidateUtil.toFixed(value, 2, 3)
    if (!JudgeUtil.isEmpty(value) && Number(value) > 200) {
      value = ValidateUtil.toFixed('200', 2, 3)
    } else if (!JudgeUtil.isEmpty(value) && Number(value) < 1) {
      value = ValidateUtil.toFixed('1', 2, 3)
    }
    return value
  }

  /** 验证姓名 */
  validatorUserName = (rules:any, value:any, callback: Function) => {
    if (!JudgeUtil.isEmpty(value)) {
      let reg = /^\S[\u0391-\uFFE5a-zA-Z\s]+$/
      if (!reg.test(value)) {
        callback(new Error('请输入中文或英文'))
      }
    }
    callback()
  }

  render () {
    const { visible, form } = this.props
    const { getFieldDecorator } = form
    const { visibleModal, errorMsg, disabledBtn } = this.state
    const propsModal = {
      title: '新增',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel,
      footer: false,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="姓名">
            {getFieldDecorator('userName', {
              rules: [
                { required: false, validator: this.validatorUserName }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input type="text" maxLength={30} allowClear className="cus-input-197" placeholder="请输入姓名"></Input>
            )}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('phoneNumber', {
              rules: [
                { required: true, validator: ValidateUtil.validatePhoneTwo }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            })(
              <Input type="text" minLength={11} maxLength={11} allowClear className="cus-input-197" placeholder="请输入手机号"></Input>
            )}
          </Form.Item>
          <Form.Item label="金额">
            {getFieldDecorator('rechargeAmount', {
              rules: [{
                required: true, validator: this.validatorRechargeAmount
              }],
              getValueFromEvent: this.getValueFromEventAmount
            })(<Input type="text" maxLength={6} allowClear className="cus-input-197" placeholder="请输入金额"></Input>)}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 14, offset: 8 }} className="btn-inline-group">
            <Button type="primary" disabled={disabledBtn} htmlType="submit">新建</Button>
            <Button onClick={this.handleModel.bind(this, 0)}>取消</Button>
          </Form.Item>
        </Form>
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

export default Form.create<AddModalProps>()(AddModal)
