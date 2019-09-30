/**
 * @description 意见反馈-答复
 * @author minjie
 * @createTime 2019/06/21
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import moment from 'moment'
import { RootComponent, BasicModal, ImgPreview } from '@components/index'
import { Form, Input, Button, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from 'typings/global'

import { ReplyInfo } from './components/Info'

import noimg from '@assets/images/icon/noimg.png'

import './style/reply.styl'
import { JudgeUtil, SysUtil, globalEnum } from '@utils/index'

const { TextArea } = Input

interface ReplyProps extends FormComponentProps, BaseProps {
}

interface ReplyState {
  feedbackId: number
  replyInfo: ReplyInfo
  errorMsg: string
  visible: boolean
  imgaeSrc: string
  disableBtn: boolean
  visibleModal: boolean
}

class Reply extends RootComponent<ReplyProps, ReplyState> {
  constructor (props:ReplyProps) {
    super(props)
    let { feedbackId } = this.props.match.params
    this.state = {
      feedbackId,
      replyInfo: new ReplyInfo(),
      errorMsg: '',
      visible: false,
      imgaeSrc: noimg,
      disableBtn: false,
      visibleModal: false
    }
  }

  componentDidMount () {
    this.getDetail()
  }

  getDetail = () => {
    const { feedbackId } = this.state
    if (feedbackId) {
      this.axios.request(this.api.feedbackDetail, { feedbackId }).then((res:any) => {
        const { data } = res
        this.setState({ replyInfo: data })
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }

  imgError = (e:any) => {
    let img = e.target
    img.src = noimg
    img.alt = '加载失败'
  }

  /** 回复信息 */
  handalSubmitReply = (e:any) => {
    e.preventDefault()
    const { feedbackId } = this.state
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        let userId = SysUtil.getLocalStorage(globalEnum.userID)
        values['feedbackId'] = Number(feedbackId)
        values['userId'] = Number(userId)
        this.setState({ disableBtn: true })
        if (values.hasOwnProperty('replyContent')) { // 反馈回复
          this.axios.request(this.api.feedbackUpdate, values).then((res:any) => {
            this.$message.success('回复成功！')
            this.setState({ disableBtn: false })
            this.goBack()
          }).catch((err:any) => {
            let { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleModal(1)
          })
        } else { // 回复的会话
          values['feedbackSessionType'] = 'text'
          this.axios.request(this.api.feedbackUpdateSession, values).then((res:any) => {
            this.$message.success('回复成功！')
            this.setState({ disableBtn: false })
            this.goBack()
          }).catch((err:any) => {
            let { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleModal(1)
          })
        }
      }
    })
  }

  /** 返回上一级页面 */
  goBack = () => {
    this.props.history.push('/home/company/feedback')
  }

  /** 错误提示框 */
  handleModal = (num:number) => {
    this.setState({ visibleModal: num !== 0 })
  }

  /** 是否关闭 */
  imgPreviewVsibale = (num:number, imgaeSrc:string) => {
    this.setState({ visible: num === 1, imgaeSrc })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { replyInfo, errorMsg, visible, imgaeSrc, disableBtn, visibleModal } = this.state
    const layoutFrom = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
    return (
      <div className='cus-home-content'>
        <Form layout='inline' {...layoutFrom} onSubmit={this.handalSubmitReply}>
          <Row>
            <Col span={12}>
              <Form.Item label='用户姓名' className='cus-from-item'>
                {replyInfo.feedbackerName}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='手机号' className='cus-from-item'>
                {replyInfo.feedbackerPhone}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='反馈平台' className='cus-from-item'>
                {replyInfo.feedbackDevice || '---'}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='创建时间' className='cus-from-item'>
                {replyInfo.feedbackTime && moment(replyInfo.feedbackTime).format('YYYY-MM-DD HH:mm')}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='反馈类型' className='cus-from-item'>
                {replyInfo.feedbackType}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='反馈内容' className='cus-from-item reply-question'>
                <div className='question content'>
                  {replyInfo.feedbackContent}
                  <div className='question-img-list'>
                    {replyInfo.firstPhotoPath && <img
                      onClick={this.imgPreviewVsibale.bind(this, 1, replyInfo.firstPhotoPath || noimg)}
                      onError={this.imgError.bind(this)}
                      src={replyInfo.firstPhotoPath || noimg}/>}
                    {replyInfo.secondPhotoPath && <img
                      onClick={this.imgPreviewVsibale.bind(this, 1, replyInfo.secondPhotoPath || noimg)}
                      onError={this.imgError.bind(this)}
                      src={replyInfo.secondPhotoPath || noimg}/>}
                    {replyInfo.thirdPhotoPath && <img
                      onClick={this.imgPreviewVsibale.bind(this, 1, replyInfo.thirdPhotoPath || noimg)}
                      onError={this.imgError.bind(this)}
                      src={replyInfo.thirdPhotoPath || noimg}/>}
                  </div>
                </div>
              </Form.Item>
            </Col>
          </Row>
          {replyInfo.replyContent && <Row><Col span={12}>
            <Form.Item label={`我的回复`} className='cus-from-item reply-question'>
              <div className='content question'>
                {replyInfo.replyContent}
              </div>
            </Form.Item>
          </Col></Row>}
          {replyInfo.sessionList && replyInfo.sessionList.map((el:any, key:number) => (
            <Row key={key}>
              {el.feedbackSessionIdentifier === 1 ? <Col span={12}>
                <Form.Item label={`答复`} className='cus-from-item reply-question'>
                  <div className='content question'>
                    {el.feedbackSessionType === 'text' && el.feedbackSessionContentOrReply}
                    <p className='p-time'>{moment(el.feedbackOrReplyTime).format('YYYY-MM-DD HH:mm')}</p>
                  </div>
                </Form.Item>
              </Col> : <Col span={12}>
                <Form.Item label={`用户回复`} className='cus-from-item reply-question'>
                  <div className='content question'>
                    {el.feedbackSessionType === 'text' && el.feedbackSessionContentOrReply}
                    {el.feedbackSessionType === 'img' && <img
                      onClick={this.imgPreviewVsibale.bind(this, 1, el.feedbackSessionContentOrReply || noimg)}
                      onError={this.imgError.bind(this)}
                      src={el.feedbackSessionContentOrReply || noimg}/>}
                    <p className='p-time'>{moment(el.feedbackOrReplyTime).format('YYYY-MM-DD HH:mm')}</p>
                  </div>
                </Form.Item>
              </Col>}
            </Row>
          ))}
          <Row style={{ marginTop: 27 }}>
            <Col span={12}>
              <Form.Item label='回复内容' className='cus-from-item'>
                {getFieldDecorator(JudgeUtil.isEmpty(replyInfo.replyContent) ? 'replyContent' : 'feedbackSessionContent', {
                  rules: [{ required: true, message: '请输入回复内容' }]
                })(
                  <TextArea autosize={{ minRows: 4, maxRows: 6 }} placeholder='回复内容'/>
                )}
              </Form.Item>
              <Form.Item wrapperCol={{ span: 16, offset: 5 }} className='cus-from-item btn-inline-group'>
                <Button type="primary" disabled={disableBtn} htmlType="submit">确认回复</Button>
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
        <ImgPreview visible={visible}
          src={imgaeSrc}
          onClose={this.imgPreviewVsibale}
          isAlwaysCenterZoom={false}
          isAlwaysShowRatioTips={false}/>
      </div>
    )
  }
}

export default Form.create<ReplyProps>()(Reply)
