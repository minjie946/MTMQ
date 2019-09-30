/**
 * @description 在招岗位-岗位详情
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Form, Row, Col } from 'antd'
import { BaseProps } from 'typings/global'
import { PostInfo } from './components/info'

import './style/detail.styl'
import { SysUtil, globalEnum } from '@utils/index'

interface RecruitmentEditOrAddProps extends BaseProps {
}

interface RecruitmentEditOrAddState {
  prId:number
  // 错误的消息
  errorMsg: string
  // 保存岗位的信息
  postInfo: PostInfo
  // 电子模板
  InterviewAry: Array<any>
  // 是日结还是月结
  isClearingForm: boolean
  visibleModal: boolean
}

export default class RecruitmentEditOrAdd extends RootComponent<RecruitmentEditOrAddProps, RecruitmentEditOrAddState> {
  constructor (props:RecruitmentEditOrAddProps) {
    super(props)
    const { prId } = this.props.match.params
    this.state = {
      prId,
      errorMsg: '',
      postInfo: new PostInfo(),
      InterviewAry: [],
      isClearingForm: false,
      visibleModal: false
    }
  }

  componentDidMount () {
    const { prId } = this.state
    if (prId) { // 修改
      this.getDetail(prId)
    }
    this.initSelectData()
  }

  /** 初始化数据 */
  initSelectData = () => {
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.interviewInterviewList, { userId }).then((d:any) => {
      let InterviewAry = d.data || []
      this.setState({
        InterviewAry
      })
    }).catch((err:any) => console.log(err))
  }

  /** 获取详细的信息 */
  getDetail = (prId:number) => {
    this.axios.request(this.api.recruitmentDetail, { prId: Number(prId) }).then((res:any) => {
      const { data } = res
      this.setState({ postInfo: data })
    }).catch((err:any) => console.log(err))
  }

  /** 返回上一级页面 */
  goBack = () => {
    this.props.history.push('/home/recruit/recruitment')
  }

  /** 错误的谭弹框的显示 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const { prId, postInfo, errorMsg, isClearingForm, InterviewAry, visibleModal } = this.state
    const layoutForm = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 }
    }
    const { clearingForm, contractSubject, contractType,
      highestSalary, lowestSalary, organize, postDescribe,
      postFeature, postName, postRequirement, prType, projectName, recruitNumber,
      salary, workAddress, electronInterviewId, province, city, district
    } = postInfo as PostInfo
    let electronInterview = InterviewAry.filter((el:any) => el.electronInterviewId === electronInterviewId)
    return (
      <div className='cus-home-content'>
        <Form {...layoutForm}>
          <Row>
            <Col span={12}>
              <Form.Item label='地区'>
                {province + '-' + city + '-' + district}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='项目'>
                {projectName}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='岗位类别'>
                {prType}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='部门' wrapperCol={{ span: prId ? 18 : 10 }} className='cus-input'>
                {organize}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='合同主体'>
                {contractSubject}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='岗位名称'>
                {postName}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='合同类型'>
                {contractType}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='招收人数'>
                {recruitNumber}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='结算方式'>
                {clearingForm}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item wrapperCol={{ span: 18 }} label='岗位特色' className='cus-input'>
                {postFeature}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='薪资'>
                {isClearingForm ? salary : lowestSalary + '~' + highestSalary}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='岗位要求' wrapperCol={{ span: 18 }} className='cus-input'>
                {postRequirement}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='工作地址'>
                {workAddress}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='电子模板'>
                {electronInterview.length > 0 ? electronInterview[0].templateName : '- - -'}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='岗位简介' wrapperCol={{ span: 18 }}>
                <div className='detail-content'>{postDescribe}</div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item className='btn-inline-group' wrapperCol={{ span: 18, offset: 6 }}>
                <Button onClick={this.goBack}>返回</Button>
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
