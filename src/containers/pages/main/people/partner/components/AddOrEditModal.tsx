/**
 * @description model 表单
 * @author minjie
 * @createTime 2019/07/5
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, Select, Button, Row, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum } from '@utils/index'

interface ModalFormProps extends FormComponentProps {
  ecId: number
  type: 'edit' | 'add'
  onCancel?: Function
  visible?: boolean
}

interface ModalFormState {
  // 隶属团队
  partnerTeam: Array<any>
  // 隶属团队是否显示
  teamShow: boolean
  // 错误消息
  errorMsg: string
  // 按钮禁用
  disabledBtn: boolean
  phoneNumberAry:Array<any>
  visibleModal: boolean
}

class ModalForm extends RootComponent<ModalFormProps, ModalFormState> {
  constructor (props:ModalFormProps) {
    super(props)
    this.state = {
      partnerTeam: ['罪案', '试试', '萨达'],
      teamShow: false,
      errorMsg: '',
      disabledBtn: false,
      phoneNumberAry: [],
      visibleModal: false
    }
  }

  componentDidUpdate (prevProps:any) {
    let { ecId, type } = this.props
    if (type === 'edit' && ecId !== prevProps.pmId && ecId !== -1) {
      // this.getDetail(ecId)
    }
  }

  /** 提交信息 */
  handleSubmitAfter = (e:any) => {
    e.preventDefault()
    const { type } = this.props
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        this.setState({ disabledBtn: true })
        if (type === 'edit') {
          // this.handleModel(3)
          // this.axios.request(this.api.queryNewAdd, values).then((res:any) => {
          //   this.$message.success('修改成功')
          //   this.handleModel(1) // 关闭，之后记得刷新
          // }).catch((err:any) => {
          //   const { msg } = err
          //   this.setState({ errorMsg: msg || err })
          //   this.handleBasicModal(1)
          // }).finally(() => {
          //   this.setState({ disabledBtn: false })
          // })
        } else {
          let userId = SysUtil.getLocalStorage(globalEnum.userID)
          values['createUserId'] = userId
          delete values['phoneNumber']
          this.axios.request(this.api.partnerAdd, values).then((res:any) => {
            this.$message.success('新增成功！')
            this.handleModel(1) // 关闭，之后记得刷新
          }).catch((err:any) => {
            const { msg } = err
            this.setState({ errorMsg: msg || err })
            this.handleBasicModal(1)
          }).finally(() => {
            this.setState({ disabledBtn: false })
          })
        }
      }
    })
  }

  /** 类型改变 */
  partnerTypeChange = (value:any) => {
    this.setState({ teamShow: value === '合伙人' })
  }

  /** 当前窗口的 开关 num: 0 不刷新 1 刷新 */
  handleModel = (num:number) => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.props.form.resetFields()
    if (onCancel) onCancel(false, num)
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 搜索候选者 */
  phoneNumberChange = (e :any) => {
    let phoneNumber = e.target.value
    this.axios.request(this.api.partnerMaybePartner, { phoneNumber }).then((res:any) => {
      this.setState({ phoneNumberAry: res.data || [] })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    }
    const { disabledBtn, errorMsg, visibleModal, phoneNumberAry } = this.state
    const { visible, type, form } = this.props
    const { getFieldDecorator } = form
    const propsModal = {
      title: type !== 'edit' ? '新增合伙人' : '修改合伙人',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, 0),
      footer: false,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <Form {...formItemLayout} onSubmit={this.handleSubmitAfter}>
          <Form.Item label="类型">
            {getFieldDecorator('partnerType', {
              initialValue: '合伙人BD',
              rules: [{ required: true, message: '请选择类型' }]
            })(
              <Select allowClear onChange={this.partnerTypeChange} placeholder="请选择类型" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                <Select.Option value='合伙人BD'>合伙人BD</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="合伙人手机号">
            {getFieldDecorator('phoneNumber', {
              rules: [{ required: true, message: '根据手机号搜索合伙人' }]
            })(
              <Input type="text" onChange={this.phoneNumberChange} maxLength={11} allowClear placeholder="请输入手机号"></Input>
            )}
            {/* {
              rules: [
                { required: true, validator: ValidateUtil.validatePhone }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            } */}
          </Form.Item>
          <Form.Item label="合伙人姓名">
            {getFieldDecorator('userId', {
              rules: [{ required: true, message: '请选择候选人' }]
            })(
              <Select placeholder='请选择候选人' >
                {phoneNumberAry.map((el:any, key:number) => (
                  <Select.Option key={key} value={el.userId}>{el.userName}</Select.Option>
                ))}
              </Select>
              // <Input type="text" maxLength={30} allowClear placeholder="请输入合伙人姓名"></Input>
            )}
          </Form.Item>
          {/* {type !== 'edit' && teamShow && <Form.Item label="隶属团队">
            {getFieldDecorator('team', {
              rules: [{ required: true, message: '请选择隶属团队' }]
            })(
              <Select allowClear placeholder="请选择隶属团队" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                {partnerTeam.map((el:any, key:number) => (
                  <Select.Option key={key} value={el}>{el}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>} */}
          <Form.Item wrapperCol={{ span: 14, offset: 8 }} className="btn-inline-group">
            <Button type="primary" disabled={disabledBtn} htmlType="submit">{type === 'edit' ? '保存' : '新建'}</Button>
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

export default Form.create<ModalFormProps>({})(ModalForm)
