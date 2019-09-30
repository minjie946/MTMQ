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
import { Form, Input, Button, Row, Col, Tabs, Icon, List } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { JudgeUtil, SysUtil, globalEnum } from '@utils/index'

import { InterViewInfo } from './components/Info'

import './style/addorUpdate.styl'

const { TabPane } = Tabs
const { TextArea } = Input

interface AddPageProps extends BaseProps, FormComponentProps {
}

interface AddPageState {
  tabPaneAry: Array<any>
  electronInterviewId:number
  arySortState: Array<number>
  interViewInfo: InterViewInfo
  errorMsg: string
  loadMore: boolean
  disableBtn: boolean
  visibleModal: boolean
}

let varNum = 1

class AddPage extends RootComponent<AddPageProps, AddPageState> {
  constructor (props:AddPageProps) {
    super(props)
    let { electronInterviewId } = this.props.match.params
    this.state = {
      electronInterviewId,
      arySortState: [1],
      interViewInfo: new InterViewInfo(),
      errorMsg: '',
      tabPaneAry: [],
      loadMore: false,
      disableBtn: false,
      visibleModal: false
    }
  }

  componentDidMount () {
    this.getDetail()
  }

  /** 获取详情 */
  getDetail = () => {
    const { electronInterviewId } = this.state
    this.getPostList(electronInterviewId) // 请求对应的岗位的信息
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.interviewDetail, {
      electronInterviewId,
      userId
    }).then((res:any) => {
      let { data } = res
      const { questionList } = data
      let arySortState:Array<number> = []
      questionList.forEach((el:any, key:number) => {
        data[`eiqId${key + 1}`] = el.eiqId
        data[`questionValue${key + 1}`] = el.questionValue
        arySortState.push(key + 1)
      })
      varNum = questionList.length
      this.setState({ interViewInfo: data, arySortState })
    }).catch((err:any) => console.log(err))
  }

  /** 获取对应的模板中的组织和岗位 */
  getPostList = (electronInterviewId:number) => {
    this.axios.request(this.api.recruitmentGetOrganize, {
      electronInterviewId
    }).then((res:any) => {
      const { data } = res
      let tabPaneAry:any = []
      data.forEach((el:any) => {
        let obj = tabPaneAry.findIndex((eld:any) => eld.title === el.postName)
        if (obj >= 0) {
          tabPaneAry[obj].items.push({ id: el.prId, name: el.organize })
        } else {
          tabPaneAry.push({
            title: el.postName,
            items: [{ id: el.prId, name: el.organize }]
          })
        }
      })
      this.setState({ tabPaneAry })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 提交信息 */
  handalSubmit = (e:any) => {
    e.preventDefault()
    const { form } = this.props
    form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        let questionList:Array<any> = []
        values.keys.forEach((el:any, key:number) => {
          let questionValue = values[`questionValue${el}`]
          let eiqId = values[`eiqId${el}`]
          delete values[`questionValue${el}`]
          delete values[`eiqId${el}`]
          if (!JudgeUtil.isEmpty(questionValue)) {
            questionList.push({
              eiqId,
              electronInterviewId: values['electronInterviewId'],
              questionNumber: `问题${key + 1}`,
              questionValue
            })
          }
        })
        delete values.keys
        values['questionList'] = this.contrast(questionList)
        this.setState({ disableBtn: true })
        this.axios.request(this.api.interviewUpdate, values).then((res:any) => {
          this.$message.success('修改模板成功！')
          this.goBack()
        }).catch((err:any) => {
          let { msg } = err
          this.setState({ errorMsg: msg || err, disableBtn: true })
          this.handleModal(1)
        })
      }
    })
  }

  /** 判断是否是没有修改过的 */
  contrast = (ary:any) => {
    const { questionList } = this.state.interViewInfo
    if (questionList && questionList.length === ary.length) {
      for (let index = 0; index < questionList.length; index++) {
        const el = questionList[index]
        let obj = ary.find((fd:any) => el.eiqId === fd.eiqId)
        if (obj && (obj.questionNumber !== el.questionNumber || obj.questionValue !== el.questionValue)) { // 存在比较一下值是否相同
          return ary
        }
      }
      return []
    } else {
      return ary
    }
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
      delete this.state.interViewInfo[`questionValue${keyd}`]
      delete this.state.interViewInfo[`eiqId${keyd}`]
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

  loadMoreFun = (num:number) => {
    this.setState({ loadMore: num === 1 })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { tabPaneAry, electronInterviewId, arySortState, interViewInfo, errorMsg, loadMore, disableBtn, visibleModal } = this.state
    const layOutForm = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    getFieldDecorator('keys', { initialValue: arySortState })
    if (electronInterviewId && electronInterviewId !== -1) getFieldDecorator('electronInterviewId', { initialValue: Number(electronInterviewId) })
    const keys = getFieldValue('keys')
    keys.forEach((el:any) => {
      getFieldDecorator(`eiqId${el}`, { initialValue: interViewInfo[`eiqId${el}`] })
    })
    return (
      <div className='interview-content'>
        <Form hideRequiredMark onSubmit={this.handalSubmit} {...layOutForm}>
          <Row>
            <Col span={8}>
              <Form.Item label='模板名称'>
                {getFieldDecorator('templateName', {
                  initialValue: interViewInfo.templateName,
                  rules: [{ required: true, message: '请输入模板名称' }]
                })(
                  <Input allowClear placeholder='请输入模板名称'/>
                )}
              </Form.Item>
            </Col>
          </Row>
          {tabPaneAry.length > 0 && <Row>
            <Col span={23} offset={1}>
              <div className='cus-tabs-container'>
                <Tabs type="card" defaultActiveKey='岗位1'>
                  {tabPaneAry.map((el:any) => (
                    <TabPane tab={el.title} key={el.title}>
                      <List
                        grid={{ gutter: 4, column: 3 }}
                        dataSource={loadMore ? el.items : el.items.slice(0, 9)}
                        renderItem={(item:any) => (
                          <List.Item>
                            <div className="cus-recriut-orgianztion-post">
                              <span>{item.name}</span>
                            </div>
                          </List.Item>
                        )}
                      />
                      {el.items.length > 9 && <Row className='cus-interview-btn'>
                        <Col>
                          {loadMore ? <Button type="primary" onClick={this.loadMoreFun.bind(this, 0)} ghost>收起</Button>
                            : <Button type="primary" onClick={this.loadMoreFun.bind(this, 1)} ghost>查看更多</Button>}
                        </Col>
                      </Row>}
                    </TabPane>
                  ))}
                </Tabs>
              </div>
            </Col>
          </Row>}
          <Row style={{ marginTop: tabPaneAry.length > 0 ? 48 : 0 }}>
            <Col span={8}>
              <Form.Item label='开场白' className='cus-interview-textarea'>
                {getFieldDecorator('startSentence', {
                  initialValue: interViewInfo.startSentence,
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
                      initialValue: interViewInfo[`questionValue${el}`],
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
                <Button type="primary" disabled={disableBtn} htmlType="submit">保存</Button>
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
