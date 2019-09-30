/**
 * @description 消息推送
 * @author minjie
 * @createTime 2019/08/06
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, BasicModal } from '@components/index'
import { BaseProps } from '@typings/global'
import { Form, Button, Row, Col, Input, Select, Radio } from 'antd'
import { ValidateUtil } from '@utils/index'
import { ProjectCheck } from '@shared/index'
import { inject, observer } from 'mobx-react'

const layoutFrom = {
  labelCol: { span: 3 },
  wrapperCol: { span: 6 }
}

interface MessageAddAndEditProps extends FormComponentProps, BaseProps {
  mobxCommon?: any
}

interface MessageAddAndEditState {
  // 错误消息
  errorMsg: string
  // 按钮的禁用
  disableBtn: boolean
  messageInfo: any
  pushMessageId: number
  pushMode: number
  visibleModal: boolean
}

@inject('mobxCommon')
@observer
class MessageAddAndEdit extends RootComponent<MessageAddAndEditProps, MessageAddAndEditState> {
  constructor (props:MessageAddAndEditProps) {
    super(props)
    let { id } = this.props.match.params
    this.state = {
      errorMsg: '',
      disableBtn: false,
      messageInfo: {},
      pushMessageId: id || -1,
      pushMode: 1,
      visibleModal: false
    }
  }

  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0

  componentDidMount () {
    // 获取资讯的信息
    this.props.mobxCommon.getInfomation()
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

  /** 错误的谭弹框的显示 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 返回上一页 */
  goBack = () => {
    this.props.history.replace('/home/company/messagepush')
  }

  /** 提交信息 */
  handelSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        const { pushMessageId, pushMode } = this.state
        this.setState({ disableBtn: true })
        if (pushMessageId !== -1) { // 修改
          this.axios.request(this.api.messagePushUpdate, {
            ...values,
            pushMessageId
          }).then((res:any) => {
            this.$message.success('修改推送消息成功！')
            this.setState({ disableBtn: false })
            this.goBack()
          }).catch((err:any) => {
            let { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleBasicModal(1)
          })
        } else {
          this.axios.request(this.api.messagePushAdd, values).then((res:any) => {
            this.$message.success('新增推送消息成功！')
            this.setState({ disableBtn: false })
            this.goBack()
          }).catch((err:any) => {
            let { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleBasicModal(1)
          })
        }
      }
    })
  }

  /** 按钮改变 */
  onRadioChange = (e:any) => {
    this.setState({ pushMode: e.target.value })
  }

  render () {
    const { mobxCommon: { projectAry, informationAry }, form: { getFieldDecorator } } = this.props
    const { errorMsg, disableBtn, messageInfo, pushMessageId, pushMode, visibleModal } = this.state
    const { pushMessageTitle, pushMessageContent, pushPath, projectName } = messageInfo
    return (
      <div className='cus-home-content'>
        <Form {...layoutFrom} onSubmit={this.handelSubmit}>
          <Row>
            <Col span={20}>
              <Form.Item label='推送标题' className='cus-from-item'>
                {getFieldDecorator('pushMessageTitle', {
                  initialValue: pushMessageTitle,
                  rules: [{ required: true, validator: ValidateUtil.validateChinese }],
                  getValueFromEvent: ValidateUtil.getValueFromMessagePush
                })(<Input allowClear maxLength={30} placeholder='请输入推送标题'/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='推送内容' className='cus-from-item' wrapperCol={{ span: 12 }}>
                {getFieldDecorator('pushMessageContent', {
                  initialValue: pushMessageContent,
                  rules: [{ required: true, message: '请输入推送内容' }]
                })(<Input.TextArea rows={6} maxLength={140} placeholder='请输入推送内容'/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='推送链接'>
                {getFieldDecorator('pushMode', {
                  initialValue: pushMode || 1,
                  rules: [{ required: true }]
                })(
                  <Radio.Group onChange={this.onRadioChange}>
                    <Radio value={1}>外部链接</Radio>
                    <Radio value={0}>内部链接</Radio>
                  </Radio.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item wrapperCol={{ span: 6, offset: 3 }}>
                {pushMode === 0 && informationAry.length > 0 ? getFieldDecorator('pushPath', {
                  initialValue: pushPath ? isNaN(Number(pushPath)) ? undefined : Number(pushPath) : undefined,
                  rules: [{ required: true, message: '请选择' }]
                })(<Select placeholder='请选择' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  {informationAry.map((el:any, key:number) => (
                    <Select.Option key={key} value={el.infoId}>{el.infoTitle}</Select.Option>
                  ))}
                </Select>) : getFieldDecorator('pushPath', {
                  initialValue: pushPath,
                  rules: [{ type: 'url', required: true, message: '请输入URL地址' }]
                })(<Input maxLength={140} allowClear placeholder='请输入URL地址'/>)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='所属项目' wrapperCol={{ span: 12 }} className='cus-from-item'>
                {getFieldDecorator('projectName', {
                  initialValue: projectName,
                  rules: [
                    { required: true, message: '请选择所属项目' }
                  ]
                })(<ProjectCheck />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item wrapperCol={{ span: 20, offset: 3 }} className='cus-from-item btn-inline-group'>
                <Button htmlType="submit" type='primary' disabled={disableBtn}>
                  {pushMessageId !== -1 ? '保存' : '新增'}
                </Button>
                <Button htmlType="button" onClick={this.goBack}>返回</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          <Row className='cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}

export default Form.create<MessageAddAndEditProps>()(MessageAddAndEdit)
