/**
 * @description 待入职-人员信息查看审核
 * @author minjie
 * @createTime 2019/08/20
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import { JudgeUtil, SysUtil, globalEnum } from '@utils/index'
import { RootComponent, BasicModal, ImgPreview } from '@components/index'
import { Form, Button, Row, Col, Divider, Modal } from 'antd'
import { userBankPNG, userGroupPNG, userInfoPNG, userShezhiPNG } from '@components/icon/BasicIcon'
import moment from 'moment'
import { PeopleNewModel } from '../components/query'

import noimg from '@assets/images/icon/noimg.png'

import '../style/detail.styl'
import { number } from 'prop-types'

interface PeopleInfoDetailProps extends BaseProps, FormComponentProps {
}

interface PeopleInfoDetailState {
  // 保存详情
  userInfo:PeopleNewModel
  // 用户编号
  neId: any
  // 错误消息
  errorMsg: string
  disbaled:boolean
  updateUser: number
  phoneNumber:string
  bankCardId: any
  // tab状态
  status:string
  visible: boolean
  imgaeSrc: string
  contractUrl: string
  constractModal: boolean
  visibleModal: boolean
}

class PeopleInfoDetail extends RootComponent<PeopleInfoDetailProps, PeopleInfoDetailState> {
  constructor (props:PeopleInfoDetailProps) {
    super(props)
    let updateUser = SysUtil.getLocalStorage(globalEnum.userID) || 0
    const { match } = this.props
    let neId = match.params.id || 0
    let ary = match.url.split('/')
    this.state = {
      userInfo: new PeopleNewModel(),
      neId,
      errorMsg: '',
      disbaled: false,
      updateUser,
      status: ary[ary.length - 2],
      bankCardId: null,
      phoneNumber: '',
      visible: false,
      imgaeSrc: noimg,
      contractUrl: '',
      constractModal: false,
      visibleModal: false
    }
  }

  handleModalKey: number = 0
  reviewStepKey: number = -1

  /** 初始加载数据 */
  componentDidMount () {
    const { neId } = this.state
    if (neId !== 0) { // 查询详情
      this.getDetail(neId)
    }
  }

  /** 获取电子合同 */
  getConstract = (userId: number) => {
    this.axios.request(this.api.queryContractUrl, { userId }).then((res:any) => {
      const { data } = res
      this.setState({ contractUrl: data })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 获取用户的信息 */
  getDetail = (neId:any) => {
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.queryNewDetail, {
      neId: neId,
      userId
    }).then(({ data }:any) => {
      this.setState({
        userInfo: data,
        phoneNumber: data.phoneNumber,
        bankCardId: data.bankCardId
      })
      if (data && data.userId) {
        this.getConstract(data.userId)
      }
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 返回上一个界面 */
  goBack = () => {
    this.props.history.push('/home/people/query?type=new')
  }

  /** 通过审批按钮 之前 */
  handleSubmitAfter = (e:any) => {
    e.preventDefault()
    this.setState({ errorMsg: `确认审批通过?` })
    this.reviewStepKey = -1
    this.handleModalKey = 5 // 驳回银行卡
    this.handleModal(1)
  }

  handleSubmit = () => { // 通过审批按钮
    const { phoneNumber, updateUser } = this.state
    this.setState({ disbaled: true })
    this.axios.request(this.api.reviewPass, {
      phoneNumber,
      updateUser
    }).then((res:any) => {
      this.$message.success('审批通过')
      this.goBack()
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err, disbaled: false })
      this.handleModalKey = 0
      this.handleModal(1)
    })
  }

  initValue = (value:any) => {
    return JudgeUtil.isEmpty(value) ? '---' : value
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleModal = (num:number) => {
    switch (num) {
      case 2: this.reviewStep(this.reviewStepKey); break // 驳回
      case 3: this.rebutContract(); break // 驳回工作及个人信息
      case 4: this.rebutBankCard(); break // 驳回银行卡
      case 5: this.handleSubmit(); break // 审批通过
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 驳回 之前 */
  reviewStepAfter = (reviewStep:any, e?:any) => {
    e.preventDefault()
    let supplyType = ''
    switch (reviewStep) {
      case 1: supplyType = '毕业证'; break
      case 2: supplyType = '户口本'; break
      case 3: supplyType = '退工单'; break
      case 4: supplyType = 'all'; break
    }
    this.setState({ errorMsg: `确认驳回${supplyType}?` })
    this.reviewStepKey = reviewStep
    this.handleModalKey = 2 // 驳回
    this.handleModal(1)
  }

  /** 审批操作  1、毕业证   2、户口本  3、退工单  4、补充信息 */
  reviewStep = (value:any) => {
    const { updateUser, phoneNumber, neId } = this.state
    this.setState({ disbaled: true })
    let dataParmas:any = {
      phoneNumber,
      supplyType: null,
      updateUser
    }
    switch (value) {
      case 1: dataParmas.supplyType = '毕业证'; break
      case 2: dataParmas.supplyType = '户口本'; break
      case 3: dataParmas.supplyType = '退工单'; break
      case 4: dataParmas.supplyType = 'all'; break
    }
    this.axios.request(this.api.rebutSupply, dataParmas).then((res:any) => {
      this.$message.success('驳回成功')
      this.getDetail(neId)
    }).catch((err:any) => {
      const { msg } = err
      this.setState({
        errorMsg: msg || err,
        disbaled: false
      })
      this.handleModalKey = 0
      this.handleModal(1)
    })
  }

  /** 驳回工作及个人信息 之前 */
  rebutContractAfter = (e?:any) => {
    e.preventDefault()
    this.setState({ errorMsg: `确认驳回工作及个人信息?` })
    this.reviewStepKey = -1
    this.handleModalKey = 3 // 驳回工作及个人信息
    this.handleModal(1)
  }

  /** 驳回工作及个人信息 */
  rebutContract = () => {
    const { phoneNumber } = this.state
    this.setState({ disbaled: true })
    this.axios.request(this.api.rebutContract, {
      phoneNumber
    }).then((res:any) => {
      this.$message.success('驳回成功')
      this.goBack()
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err, disbaled: false })
      this.handleModalKey = 0
      this.handleModal(1)
    })
  }

  /** 驳回银行卡 之前 */
  rebutBankCardAfter = (e:any) => {
    e.preventDefault()
    this.setState({ errorMsg: `确认驳回银行卡?` })
    this.reviewStepKey = -1
    this.handleModalKey = 4 // 驳回银行卡
    this.handleModal(1)
  }

  /** 驳回银行卡 */
  rebutBankCard = () => {
    const { phoneNumber, bankCardId } = this.state
    this.setState({
      disbaled: true
    })
    this.axios.request(this.api.rebutBankCard, {
      phoneNumber,
      bankCardId
    }).then((res:any) => {
      this.$message.success('驳回成功')
    }).catch((err:any) => {
      const { msg } = err
      this.setState({
        errorMsg: msg || err,
        disbaled: false
      })
      this.handleModalKey = 0
      this.handleModal(1)
    })
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 是否关闭 */
  imgPreviewVsibale = (num:number, imgaeSrc:string) => {
    this.setState({ visible: num === 1, imgaeSrc })
  }

  initPlaceCountry = () => {
    const { userInfo } = this.state
    const { nativePlaceCountry, nativePlaceCounty, nativePlaceProvince, nativePlaceCity, nativePlaceDetail } = userInfo
    let str = ''
    if (!JudgeUtil.isEmpty(nativePlaceCountry)) {
      str += nativePlaceCountry
    }
    if (!JudgeUtil.isEmpty(nativePlaceProvince)) {
      str += nativePlaceProvince
    }
    if (!JudgeUtil.isEmpty(nativePlaceCounty)) {
      str += nativePlaceCounty
    }
    if (!JudgeUtil.isEmpty(nativePlaceCity)) {
      str += nativePlaceCity
    }
    if (!JudgeUtil.isEmpty(nativePlaceDetail)) {
      str += nativePlaceDetail
    }
    return str === '' ? '---' : str
  }

  /** 显示隐藏 */
  constractModalShow = (constractModal:boolean) => {
    this.setState({ constractModal })
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 }
    }
    const { userInfo, errorMsg, disbaled, status, visible, imgaeSrc, contractUrl, constractModal, visibleModal } = this.state
    const { fddSign, intactInfo, bindCard, audit } = userInfo
    let textAry:Array<string> = []
    if (fddSign) textAry.push('待签署')
    if (intactInfo) textAry.push('待完善')
    if (bindCard) textAry.push('待绑卡')
    if (audit) textAry.push('待审核')
    return (
      <div className='people-detail-container'>
        <Form {...formItemLayout}>
          {/** 系统信息 */}
          <Row>
            <Col span={21}>
              <img className='cus-item people-icon-shezhi' src={userShezhiPNG} />
              <span className='cus-item people-detail-title'>系统信息</span>
            </Col>
          </Row>
          <Row><Col span={21}><Divider className='people-detail-divider'/></Col></Row>
          <Row>
            <Col span={10}><Form.Item label='创建时间'>{this.initValue(userInfo.createTime)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={10}><Form.Item label="数据来源">{this.initValue(userInfo.userDataSources)}</Form.Item></Col>
            <Col span={10}><Form.Item label="系统ID">{this.initValue(userInfo.userId)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={10}><Form.Item label="工作状态">{this.initValue(userInfo.workCondition)}</Form.Item></Col>
            {
              status === 'new' &&
              <Col span={12}><Form.Item label="入职状态">{textAry.length > 0 ? textAry.join('/') : '---'}</Form.Item></Col>
            }
          </Row>
          <Row>
            <Col span={10}><Form.Item label="开通模块">{this.initValue(userInfo.openService)}</Form.Item></Col>
            <Col span={10}>
              <Form.Item label="开通时间">
                { userInfo && userInfo.openServiceList && userInfo.openServiceList.length > 0
                  ? userInfo.openServiceList.map((el:any, index:any) => {
                    return <p key={index}>{el.createTime ? moment(el.createTime).format('YYYY-MM-DD HH:mm') : ''} {el.openService}</p>
                  })
                  : '---'
                }
              </Form.Item>
            </Col>
          </Row>
          {/** 工作及个人信息 */}
          <Row>
            <Col span={21}>
              <img className='cus-item people-icon-shezhi' src={userGroupPNG} />
              <span className='cus-item people-detail-title'>工作及个人信息</span>
            </Col>
          </Row>
          <Row><Col span={21}><Divider className='people-detail-divider'/></Col></Row>
          <Row>
            <Col span={10}>
              <Form.Item label="用户姓名">
                {this.initValue(userInfo.userName)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="手机号">
                {this.initValue(userInfo.phoneNumber)}
              </Form.Item>
            </Col>
            {
              userInfo.removeWork &&
              <Col span={2}>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button onClick={this.rebutContractAfter} type="primary" htmlType="submit">驳回</Button>
                </Form.Item>
              </Col>
            }
          </Row>
          <Row>
            <Col span={10}><Form.Item label="性别">{this.initValue(userInfo.sex)}</Form.Item></Col>
            <Col span={10}><Form.Item label="身份证号">{this.initValue(userInfo.idCard)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={10}><Form.Item label="年龄">{this.initValue(userInfo.userAge)}</Form.Item></Col>
            <Col span={10}><Form.Item label="户籍">{this.initPlaceCountry()}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label="岗位名称">
                {this.initValue(userInfo.postName)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="薪资">
                {this.initValue(userInfo.maxSalary)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label="项目">
                {this.initValue(userInfo.projectName)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="合同主体" className="cus-select-autowidth-240">
                {this.initValue(userInfo.contractSubject)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label="部门" className="cus-select-autowidth">
                {this.initValue(userInfo.userOrganize)}
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item label="合同类型">
                {this.initValue(userInfo.contractType)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label="电子合同">
                {!JudgeUtil.isEmpty(userInfo.ecName) ? JudgeUtil.isEmpty(contractUrl) ? userInfo.ecName : <Button type="link" onClick={this.constractModalShow.bind(this, true)}>{userInfo.ecName}</Button> : '---'}
              </Form.Item>
            </Col>
          </Row>
          {/** 银行卡信息 */}
          <Row>
            <Col span={21}>
              <img className='cus-item people-icon-shezhi' src={userBankPNG} />
              <span className='cus-item people-detail-title'>银行卡信息</span>
            </Col>
          </Row>
          <Row><Col span={21}><Divider className='people-detail-divider'/></Col></Row>
          <Row>
            <Col span={10}><Form.Item label="绑定银行卡">{this.initValue(userInfo.bankCardId)}</Form.Item></Col>
            <Col span={10}><Form.Item label="所属银行">{this.initValue(userInfo.bankName)}</Form.Item></Col>
            {
              userInfo.removeBank &&
              <Col span={2}>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button onClick={this.rebutBankCardAfter} type="primary" htmlType="submit">驳回</Button>
                </Form.Item>
              </Col>
            }
          </Row>
          {/** 补充信息 */}
          <Row>
            <Col span={21}>
              <img className='cus-item people-icon-shezhi' src={userBankPNG} />
              <span className='cus-item people-detail-title'>补充信息</span>
            </Col>
          </Row>
          <Row><Col span={21}><Divider className='people-detail-divider'/></Col></Row>
          <Row>
            <Col span={6}>
              <div className='people-icon-picture'>
                {
                  !JudgeUtil.isEmpty(userInfo.byzUrl)
                    ? <img src={userInfo.byzUrl} onClick={this.imgPreviewVsibale.bind(this, 1, userInfo.byzUrl || noimg)}/>
                    : <div className='content'>毕业证</div>
                }
                <div>
                  <span style={{ marginLeft: 105, fontSize: 16 }}>毕业证</span>
                  {
                    userInfo.removeByz
                      ? <Button onClick={this.reviewStepAfter.bind(this, 1)} type="link" style={{ marginLeft: 35, fontSize: 14 }}>驳回</Button>
                      : <Button type="link" style={{ marginLeft: 35, fontSize: 14, cursor: 'default' }}></Button>
                  }
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='people-icon-picture'>
                {
                  !JudgeUtil.isEmpty(userInfo.hkbUrl)
                    ? <img src={userInfo.hkbUrl} onClick={this.imgPreviewVsibale.bind(this, 1, userInfo.hkbUrl || noimg)}/>
                    : <div className='content'>户口本</div>
                }
                <div>
                  <span style={{ marginLeft: 105, fontSize: 16 }}>户口本</span>
                  {
                    userInfo.removeHkb
                      ? <Button onClick={this.reviewStepAfter.bind(this, 2)} type="link" style={{ marginLeft: 35, fontSize: 14 }}>驳回</Button>
                      : <Button type="link" style={{ marginLeft: 35, fontSize: 14, cursor: 'default' }}></Button>
                  }
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className='people-icon-picture'>
                {
                  !JudgeUtil.isEmpty(userInfo.tgdUrl)
                    ? <img src={userInfo.tgdUrl} onClick={this.imgPreviewVsibale.bind(this, 1, userInfo.tgdUrl || noimg)}/>
                    : <div className='content'>退工单</div>
                }
                <div>
                  <span style={{ marginLeft: 105, fontSize: 16 }}>退工单</span>
                  {
                    userInfo.removeTgd
                      ? <Button onClick={this.reviewStepAfter.bind(this, 3)} type="link" style={{ marginLeft: 35, fontSize: 14 }}>驳回</Button>
                      : <Button type="link" style={{ marginLeft: 35, fontSize: 14, cursor: 'default' }}></Button>
                  }
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}><Form.Item label="紧急联系人">{this.initValue(userInfo.emergencyContact)}</Form.Item></Col>
            <Col span={10}><Form.Item label="婚姻状况">{this.initValue(userInfo.maritalStatus)}</Form.Item></Col>
            {
              userInfo.removeSupply &&
              <Col span={2}>
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button onClick={this.reviewStepAfter.bind(this, 4)} type="primary" htmlType="submit">驳回</Button>
                </Form.Item>
              </Col>
            }
          </Row>
          <Row>
            <Col span={10}><Form.Item label="紧急联系人电话">{this.initValue(userInfo.emergencyPhone)}</Form.Item></Col>
            <Col span={10}><Form.Item label="户口性质">{this.initValue(userInfo.houseRegisterType)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={10}><Form.Item label="紧急联系人关系">{this.initValue(userInfo.emergencyRelation)}</Form.Item></Col>
            <Col span={10}><Form.Item label="联系地址">{userInfo.nowPlaceProvince + userInfo.nowPlaceCity + userInfo.nowPlaceCounty + userInfo.nowPlaceDetail || '---'}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={10}><Form.Item label="最高学历">{this.initValue(userInfo.highestDegree)}</Form.Item></Col>
          </Row>
          <Row style={{ textAlign: 'center' }} className='btn-inline-group'>
            <Col span={21}>
              <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                <Button type="primary" disabled={disbaled} onClick={this.handleSubmitAfter}>通过</Button>
                <Button htmlType="button" onClick={this.goBack}>取消</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <BasicModal visible={visibleModal} onCancel={this.handleModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
          </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            <Button onClick={this.handleModal.bind(this, 0)}>取消</Button>
          </Row>}
        </BasicModal>
        <ImgPreview visible={visible}
          src={imgaeSrc}
          onClose={this.imgPreviewVsibale}
          isAlwaysCenterZoom={false}
          isAlwaysShowRatioTips={false}/>
        <Modal width='80%' visible={constractModal} footer={null} onCancel={this.constractModalShow.bind(this, false)}>
          <iframe width='90%' height='600px' style={{ margin: '0 5%' }} src={contractUrl} frameBorder="0"></iframe>
        </Modal>
      </div>
    )
  }
}

export default Form.create<PeopleInfoDetailProps>()(PeopleInfoDetail)
