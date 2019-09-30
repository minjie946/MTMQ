/**
 * @description 公司账号管理
 * @author minjie
 * @createTime 2019/08/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Row, Form, Modal, Input } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from '@typings/global'
import { ValidateUtil, SysUtil, globalEnum } from '@utils/index'

interface BankEidtPageProps extends BaseProps, FormComponentProps {
  visible?: boolean
  onCancel?: Function
  cId: number
}

interface BankEidtPageState {
  bankInfo:any
  errorMsg: string
  disableBtn: boolean
  visibleModal: boolean
}

class BankEidtPage extends RootComponent<BankEidtPageProps, BankEidtPageState> {
  constructor (props:BankEidtPageProps) {
    super(props)
    this.state = {
      bankInfo: {},
      errorMsg: '',
      disableBtn: false,
      visibleModal: false
    }
  }

  componentDidUpdate (prevProps:any) {
    const { cId } = this.props
    if (cId !== prevProps.cId && cId !== -1) {
      this.getDetail(cId)
    }
  }

  /** 是否显示这个弹窗 */
  hanldeModal = () => {
    const { onCancel } = this.props
    this.props.form.resetFields()
    this.setState(() => {})
    if (onCancel) onCancel(false)
  }

  /** 获取详情 */
  getDetail = (cId:number) => {
    this.axios.request(this.api.companyBankDetail, { cId }).then((res:any) => {
      this.setState({ bankInfo: res.data })
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 是否显示错误的消息 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num !== 0 })
  }

  /** 提交信息 */
  handelSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        this.setState({ disableBtn: true })
        values['cId'] = this.props.cId
        values['userId'] = SysUtil.getLocalStorage(globalEnum.userID)
        this.axios.request(this.api.companyBankUpdate, values).then((res:any) => {
          this.$message.success('保存成功！')
          this.setState({ disableBtn: false })
          this.hanldeModal()
        }).catch((err:any) => {
          const { msg } = err
          this.setState({ errorMsg: msg || err, disableBtn: false })
          this.handleBasicModal(1)
        })
      }
    })
  }

  render () {
    const { bankInfo, errorMsg, disableBtn, visibleModal } = this.state
    const { visible, form } = this.props
    const { getFieldDecorator } = form
    const { bankAccount, branch, companyName } = bankInfo
    const layoutObj = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 }
    }
    return (
      <Modal title="公司信息" visible={visible} footer={null} width={460} onCancel={this.hanldeModal}>
        <Form {...layoutObj} onSubmit={this.handelSubmit}>
          <Form.Item label='公司名称'>{companyName || '---'}</Form.Item>
          <Form.Item label='银行账号'>
            {getFieldDecorator('bankAccount', {
              initialValue: bankAccount,
              rules: [
                { required: true, message: '请输入银行账号' }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            })(
              <Input allowClear maxLength={20} placeholder='请输入银行账号'></Input>
            )}
          </Form.Item>
          <Form.Item label='分行号'>
            {getFieldDecorator('branch', {
              initialValue: branch,
              rules: [
                { required: true, message: '请输入分行号' }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            })(
              <Input allowClear maxLength={20} placeholder='请输入分行号'></Input>
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 18, offset: 6 }} className="search-btn btn-inline-group">
            <Button type='primary' disabled={disableBtn} htmlType="submit">保存</Button>
            <Button onClick={this.hanldeModal.bind(this, false)}>取消</Button>
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

export default Form.create<BankEidtPageProps>()(BankEidtPage)
