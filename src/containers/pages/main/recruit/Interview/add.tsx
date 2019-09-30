/**
 * @description 电子面试-新增
 * @author minjie
 * @createTime 2019/06/21
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Add } from '@components/icon/BasicIcon'
import { BaseProps } from 'typings/global'
import { Form, Input, Button, Row, Col, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { JudgeUtil } from '@utils/index'

import './style/addorUpdate.styl'

const { TextArea } = Input

interface AddPageProps extends BaseProps, FormComponentProps {
}

interface AddPageState {
  electronInterviewId:number
  arySortState: Array<any>
  errorMsg:string
  disableBtn: boolean
  visibleModal: boolean
}

let varNum = 1

class AddPage extends RootComponent<AddPageProps, AddPageState> {
  constructor (props:AddPageProps) {
    super(props)
    this.state = {
      electronInterviewId: -1,
      arySortState: [1],
      errorMsg: '',
      disableBtn: false,
      visibleModal: false
    }
  }

  /** 提交信息 */
  handalSubmit = (e:any) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        let questionList:Array<any> = []
        values.keys.forEach((el:any, key:number) => {
          let val = values[`questionValue${el}`]
          delete values[`questionValue${el}`]
          if (!JudgeUtil.isEmpty(val)) {
            questionList.push({
              questionNumber: `问题${key + 1}`,
              questionValue: val
            })
          }
        })
        delete values.keys
        values['questionList'] = questionList
        // values['userId'] = SysUtil.getLocalStorage(globalEnum.userID)
        this.setState({ disableBtn: true })
        this.axios.request(this.api.interviewAdd, values).then((res:any) => {
          this.$message.success('新增模板成功！')
          this.goBack()
        }).catch((err:any) => {
          let { msg } = err
          this.setState({ errorMsg: msg || err, disableBtn: false })
          this.handleModal(1)
        })
      }
    })
  }

  /** 返回上一级页面 */
  goBack = () => {
    varNum = 1
    this.props.history.push('/home/recruit/interview')
  }

  /** 新增佣金的行 */
  changeItem = (num:number, keyd:number, e:any) => {
    const { setFieldsValue, getFieldValue } = this.props.form
    let keys = getFieldValue('keys')
    if (num === 0) {
      setFieldsValue({
        keys: keys.filter((key:any) => key !== keyd)
      })
    } else {
      setFieldsValue({
        keys: keys.concat(++varNum)
      })
    }
  }

  /** 错误提示框 */
  handleModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { arySortState, errorMsg, disableBtn, visibleModal } = this.state
    const layOutForm = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    getFieldDecorator('keys', { initialValue: arySortState })
    const keys = getFieldValue('keys')
    return (
      <div className='interview-content'>
        <Form onSubmit={this.handalSubmit} {...layOutForm}>
          <Row>
            <Col span={8}>
              <Form.Item label='模板名称'>
                {getFieldDecorator('templateName', {
                  rules: [{ required: true, message: '请输入模板名称' }]
                })(
                  <Input maxLength={30} allowClear className='cus-input-180' placeholder='请输入模板名称'/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Form.Item label='开场白' className='cus-interview-textarea'>
                {getFieldDecorator('startSentence', {
                  rules: [{ required: true, message: '请输入开场白' }]
                })(
                  <TextArea autosize={{ minRows: 4, maxRows: 6 }} placeholder='请输入'/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              {keys.map((el:any, key:number) => (
                <div key={key} className='question-container'>
                  <Form.Item label={`问题${key + 1}`} className='cus-interview-textarea'>
                    {getFieldDecorator(`questionValue${el}`, {
                      rules: [{ required: true, message: '请输入问题' }]
                    })(
                      <TextArea autosize={{ minRows: 4, maxRows: 6 }} placeholder='请输入'/>
                    )}
                  </Form.Item>
                  {keys.length !== 1 && <span className='cus-interview-icon'>
                    <Icon type='minus' onClick={this.changeItem.bind(this, 0, el)}/>
                  </span>}
                </div>
              ))}
            </Col>
          </Row>
          {keys.length < 30 && <Row>
            <Col span={8}>
              <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
                <div className='cus-interview-add' onClick={this.changeItem.bind(this, 1, -1)}>
                  <Add/>
                  <p>继续添加问题</p>
                </div>
              </Form.Item>
            </Col>
          </Row>}
          <Row>
            <Col span={8} className='btn-inline-group'>
              <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
                <Button type="primary" disabled={disableBtn} htmlType="submit">新增</Button>
                <Button onClick={this.goBack}>返回</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <BasicModal visible={visibleModal} onCancel={this.handleModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}

export default Form.create<AddPageProps>()(AddPage)
