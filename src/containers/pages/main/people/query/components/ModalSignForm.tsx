/**
 * @description model 新建电子单表单
 * @author minjie
 * @createTime 2019/07/18
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, Button, Row, DatePicker, Radio, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum, ValidateUtil } from '@utils/index'

import data from '@assets/images/icon/Fill.png'

interface ModalSignFormProps extends FormComponentProps {
  onCancel?: Function
  visible?: boolean
}

interface ModalSignFormState {
  // 错误消息
  errorMsg: string
  // 按钮禁用
  disabledBtn: boolean
  visibleModal: boolean
}

class ModalSignForm extends RootComponent<ModalSignFormProps, ModalSignFormState> {
  constructor (props:ModalSignFormProps) {
    super(props)
    this.state = {
      errorMsg: '',
      disabledBtn: false,
      visibleModal: false
    }
  }

  /** 提交信息 */
  handleSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        const { hiredate } = values
        values['createUser'] = SysUtil.getLocalStorage(globalEnum.userID)
        values.hiredate = hiredate.format('YYYY-MM-DD')
        this.setState({ disabledBtn: true })
        this.axios.request(this.api.insertElectronSign, values).then((res:any) => {
          this.$message.success('新增成功！')
          this.handleModel(1) // 关闭
        }).catch((err:any) => {
          this.setState({ errorMsg: err.msg[0] || err })
          this.handleBasicModal(1)
        }).finally(() => {
          this.setState({ disabledBtn: false })
        })
      }
    })
  }

  /** 当前窗口的 开关 */
  handleModel = (num: number) => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.props.form.resetFields()
    if (onCancel) onCancel(false, num)
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 8 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
    }
    const { getFieldDecorator } = this.props.form
    const { disabledBtn, errorMsg, visibleModal } = this.state
    const { visible } = this.props
    const propsModal = {
      title: '新建电子签',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, 0),
      footer: false,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <Form {...formItemLayout} onSubmit={this.handleSubmit}>
          <Form.Item label="入职日期">
            {getFieldDecorator('hiredate', {
              rules: [
                { required: true, message: '请选择入职日期' }
              ]
            })(
              <DatePicker format='YYYY-MM-DD' className='cus-input-197' suffixIcon={(<img src={data}/>)} />
            )}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('phoneNumber', {
              rules: [
                { required: true, validator: ValidateUtil.validatePhone }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            })(
              <Input type="text" minLength={5} maxLength={11} allowClear className='cus-input-197' placeholder="请输入手机号"></Input>
            )}
          </Form.Item>
          <Form.Item label="姓名">
            {getFieldDecorator('userName', {
              rules: [
                { required: true, validator: ValidateUtil.validateName }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventFirstEmptyThere
            })(
              <Input type="text" maxLength={30} allowClear className="cus-input-197" placeholder="请输入姓名"></Input>
            )}
          </Form.Item>
          <Form.Item label="是否复签">
            {getFieldDecorator('repeatSign', {
              initialValue: false,
              rules: [{ required: true, message: '请选择' }]
            })(
              <Radio.Group>
                <Radio value={false}>否</Radio>
                <Radio value={true}>是</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 14, offset: 8 }} className="btn-inline-group">
            <Button type="primary" disabled={disabledBtn} htmlType="submit">新建</Button>
            <Button onClick={this.handleModel.bind(this, 11)}>取消</Button>
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

export default Form.create<ModalSignFormProps>({})(ModalSignForm)
