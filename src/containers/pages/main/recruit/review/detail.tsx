/**
 * @description 简历审核-详情
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Row, Col, Avatar, Divider, Modal } from 'antd'
import { BaseProps } from 'typings/global'
import moment from 'moment'

import Interview from './components/Interview'
import Offer from './components/offer'

import { ReviewInfo } from './components/Info'

import './style/detail.styl'
import { SysUtil, globalEnum, JudgeUtil } from '@utils/index'

interface ReviewDetailProps extends BaseProps {
}

interface ReviewDetailState {
  // 是否禁用按钮
  disableBtn:boolean
  // 投递的ID
  deliveryId:number
  reviewInfo:ReviewInfo
  visibleOffer: boolean
  visibleInterview: boolean
}

export default class ReviewDetail extends RootComponent<ReviewDetailProps, ReviewDetailState> {
  constructor (props:ReviewDetailProps) {
    super(props)
    let { deliveryId } = this.props.match.params
    this.state = {
      disableBtn: false,
      deliveryId: deliveryId || -1,
      reviewInfo: new ReviewInfo(),
      visibleOffer: false,
      visibleInterview: false
    }
  }

  componentDidMount () {
    const { deliveryId } = this.state
    this.getDatail(deliveryId)
  }

  getDatail = (deliveryId:number) => {
    if (deliveryId && deliveryId !== -1) {
      let userId = SysUtil.getLocalStorage(globalEnum.userID)
      this.axios.request(this.api.reviewDetail, { deliveryId, userId }).then((res:any) => {
        const { data } = res
        this.setState({ reviewInfo: data })
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }

  /** 返回上一级 */
  goBack = () => {
    this.props.history.push('/home/recruit/review')
  }

  /** 时间初始化 */
  initTime = (time:any) => {
    return !JudgeUtil.isEmpty(time) ? moment(time).format('YYYY年MM月') : null
  }

  /** 发送面试邀请 */
  visibleInterviewModal = (visibleInterview: boolean, flag?: boolean) => {
    this.setState({ visibleInterview })
    if (!visibleInterview && flag) {
      this.goBack()
    }
  }

  /** 发送offer */
  visibleOfferModal = (visibleOffer: boolean, flag?: boolean) => {
    this.setState({ visibleOffer })
    if (!visibleOffer && flag) {
      this.goBack()
    }
  }

  render () {
    const { disableBtn, deliveryId, reviewInfo } = this.state
    const { visibleInterview, visibleOffer } = this.state
    return (
      <div className='cus-home-content'>
        <Row>
          <Col span={10}>
            <Row className='review-title'>
              <Col span={10}>头像:</Col>
              <Col span={14}><Avatar size={61} className='avater-icon' src={reviewInfo ? reviewInfo.userOssImg : ''} icon="user" /></Col>
            </Row>
            <Row className='review-title'>
              <Col span={10}>姓名:</Col>
              <Col span={14}>{reviewInfo && reviewInfo.userName ? reviewInfo.userName : '---'}</Col>
            </Row>
            <Row className='review-title'>
              <Col span={10}>手机号:</Col>
              <Col span={14}>{reviewInfo && reviewInfo.phoneNumber ? reviewInfo.phoneNumber : '---'}</Col>
            </Row>
            <Row className='review-title'>
              <Col span={10}>身份证:</Col>
              <Col span={14}>{reviewInfo && reviewInfo.idCard ? reviewInfo.idCard : '---'}</Col>
            </Row>
            <Row className='review-title'>
              <Col span={10}>户口性质:</Col>
              <Col span={14}>{reviewInfo && reviewInfo.hukouType ? reviewInfo.hukouType : '---'}</Col>
            </Row>
            <Row className='review-title'>
              <Col span={10}>婚姻状况:</Col>
              <Col span={14}>{reviewInfo && reviewInfo.maritalStatus ? reviewInfo.maritalStatus : '---'}</Col>
            </Row>
            <Row className='review-title'>
              <Col span={10}>最高学历:</Col>
              <Col span={14}>{reviewInfo && reviewInfo.highestDegree ? reviewInfo.highestDegree : '---'}</Col>
            </Row>
            <Row className='review-title'>
              <Col span={10}>联系地址:</Col>
              <Col span={14}>{reviewInfo && reviewInfo.contactAddress ? reviewInfo.contactAddress : '---'}</Col>
            </Row>
          </Col>
          {reviewInfo.workExperienceList && reviewInfo.workExperienceList.length > 0 && <Col span={8} offset={4}>
            <Row>
              <Col>工作经历:</Col>
            </Row>
            {reviewInfo.workExperienceList && reviewInfo.workExperienceList.map((el:any, key:number) => (
              <Row key={key} className='work-container'>
                <Col span={1}>
                  <span className='work-key'>{key + 1}.</span>
                </Col>
                <Col span={23}>
                  <div className='work-title'>
                    <span>{el.companyName}</span>
                    <span>{this.initTime(el.startTime)}-{this.initTime(el.endTime)}</span>
                  </div>
                  <p className='work-company'>{el.jobPosition}</p>
                  <div className='work-content'>
                    {el.jobDescribe}
                  </div>
                </Col>
              </Row>
            ))}
          </Col>}
        </Row>
        {reviewInfo.interviewProblemList && reviewInfo.interviewProblemList.length > 0 && <Row>
          <Row>
            <Col span={22} offset={2} className='work-question-title'>电子面试</Col>
            <Col span={22} offset={2}><Divider/></Col>
          </Row>
          {reviewInfo.interviewProblemList && reviewInfo.interviewProblemList.map((el:any, key:number) => (
            <Row key={key}>
              <Col span={20} offset={2} className='work-question'>
                <span className='question'>{el.questionNumber}</span>
                <div className='cus-item question content'>
                  {el.questionsValue}
                </div>
              </Col>
              <Col span={20} offset={2} className='work-question'>
                <span className='answer'>回答{key + 1}</span>
                <div className='cus-item content answer'>
                  {el.replyValue}
                </div>
              </Col>
            </Row>
          ))}
        </Row>}
        <Row>
          <Col span={14} offset={3} style={{ marginTop: 37 }} className='btn-inline-group'>
            {(reviewInfo.resumeState === '待面试' || reviewInfo.resumeState === '已报名') && <Button type='primary' disabled={disableBtn} onClick={this.visibleInterviewModal.bind(this, true, false)}>发送面试邀请</Button>}
            {(reviewInfo.resumeState === '待面试' || reviewInfo.resumeState === '已报名') && <Button type='primary' disabled={disableBtn} onClick={this.visibleOfferModal.bind(this, true, false)}>录用</Button>}
            <Button onClick={this.goBack}>返回</Button>
          </Col>
        </Row>
        {/** 发送面试邀请 */}
        <Interview deliveryId={deliveryId} visible={visibleInterview} onCancel={this.visibleInterviewModal}/>
        {/** 发送offer */}
        <Offer deliveryId={deliveryId} visible={visibleOffer} onCancel={this.visibleOfferModal}/>
      </div>
    )
  }
}
