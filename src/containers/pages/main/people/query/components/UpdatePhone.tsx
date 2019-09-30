/**
 * @description model 表单
 * @author minjie
 * @createTime 2019/05/14
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, Select, Button, Row, Cascader, Modal, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum, JudgeUtil, ValidateUtil } from '@utils/index'

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
}

interface UpdatePhoneProps extends FormComponentProps {
  onCancel?: Function
  visible?: boolean
}

interface UpdatePhoneState {
  // 错误消息
  errorMsg: string
  // 按钮禁用
  disabledBtn: boolean
  visibleModal: boolean
}

class UpdatePhone extends RootComponent<UpdatePhoneProps, UpdatePhoneState> {
  constructor (props:UpdatePhoneProps) {
    super(props)
    this.state = {
      errorMsg: '',
      disabledBtn: false,
      visibleModal: false
    }
  }

  timeout: any = null

  /** 初始化数据 */
  componentDidMount () {
  }

  /** 提交信息之前 */
  handleSubmitAfter = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        this.setState({ disabledBtn: true })
        values['handlerId'] = SysUtil.getLocalStorage(globalEnum.userID)
        this.axios.request(this.api.queryUpdatePhone, values).then((res:any) => {
          this.setState({ disabledBtn: false })
          this.$message.success('修改成功!')
          this.handleModel(1) // 关闭，之后记得刷新
        }).catch((err:any) => {
          this.setState({ errorMsg: err.msg || err, disabledBtn: false })
          this.handleBasicModal(1)
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
    const { getFieldDecorator } = this.props.form
    const { disabledBtn, errorMsg, visibleModal } = this.state
    const { visible } = this.props
    const propsModal = {
      title: '修改手机号',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, 0),
      footer: false,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <Form {...formItemLayout} onSubmit={this.handleSubmitAfter}>
          <Form.Item label="旧手机号">
            {getFieldDecorator('oldPhone', {
              rules: [
                { required: true, validator: ValidateUtil.validatePhone }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            })(
              <Input type="text" minLength={5} maxLength={11} allowClear className="cus-input-197" placeholder="请输入旧手机号"></Input>
            )}
          </Form.Item>
          <Form.Item label="新手机号">
            {getFieldDecorator('newPhone', {
              rules: [
                { required: true, validator: ValidateUtil.validatePhone }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            })(
              <Input type="text" minLength={5} maxLength={11} allowClear className="cus-input-197" placeholder="请输入新手机号"></Input>
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 14, offset: 8 }} className="btn-inline-group">
            <Button type="primary" disabled={disabledBtn} htmlType="submit">修改</Button>
            <Button onClick={this.handleModel.bind(this, 0)}>取消</Button>
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

export default Form.create<UpdatePhoneProps>({})(UpdatePhone)
