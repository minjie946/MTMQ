/**
 * @description 已入职-人员信息查看审核
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
import HistoricalRecords from '../components/HistoricalRecords'

import '../style/detail.styl'

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
  // tab状态
  status:string
  visible: boolean
  imgaeSrc: string
  contractUrl: string
  constractModal: boolean
  visibleModal: boolean
  historyVisible: boolean
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
      visible: false,
      imgaeSrc: noimg,
      contractUrl: '',
      constractModal: false,
      historyVisible: false,
      visibleModal: false
    }
  }

  handleModalKey: number = 0
  examineState: string = ''

  /** 初始加载数据 */
  componentDidMount () {
    const { neId } = this.state
    if (neId !== 0) { // 查询详情
      this.getDetail(neId)
    }
  }

  /** 获取用户的信息 */
  getDetail = (neId:any) => {
    this.axios.request(this.api.queryDetail, {
      userId: neId
    }).then(({ data }:any) => {
      this.setState({
        userInfo: data
      })
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 返回上一个界面 */
  goBack = () => {
    this.props.history.push('/home/people/query?type=old')
  }

  /** 审核/驳回之前 */
  toExamineAfter = (examineState:string, e:any) => { // 通过审批按钮
    e.preventDefault()
    this.setState({ errorMsg: `确认${examineState}工作及个人信息?` })
    this.examineState = examineState
    this.handleModalKey = 2 // 工作及个人信息
    this.handleBasicModal(1)
  }

  /** 审核/驳回 */
  toExamine = (examineState:string) => { // 通过审批按钮
    const { neId } = this.state
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.setState({ disbaled: true })
    this.axios.request(this.api.rebutAndreview, {
      userId: Number(neId),
      examineId: userId,
      examineState
    }).then((res:any) => {
      this.$message.success(examineState === '通过' ? '审批通过!' : '驳回成功！')
      this.goBack()
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err, disbaled: false })
      this.handleModalKey = 0
      this.examineState = ''
      this.handleBasicModal(1)
    })
  }

  initValue = (value:any) => {
    return JudgeUtil.isEmpty(value) ? '---' : value
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    if (num === 2) {
      this.toExamine(this.examineState)
    }
    this.setState({ visibleModal: num === 1 })
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

  /** 历史记录的查看和显示 */
  historyVisibleModal = (historyVisible: boolean) => {
    this.setState({ historyVisible })
  }

  /** 电子合同的历史记录和查看 */
  contractElectron = (userInfo:any, contractUrl:string, status:any) => {
    const { ecName, workCondition } = userInfo
    if (JudgeUtil.isEmpty(ecName)) {
      return '---'
    } else {
      return (
        <span>
          <span>{ecName}</span>
          {workCondition === '在职' && <span style={{ marginLeft: 6, color: '#007AFF', cursor: 'pointer' }}
            onClick={this.historyVisibleModal.bind(this, true)}>查看历史记录</span>}
        </span>
      )
    }
  }

  render () {
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 18 }
    }
    const { userInfo, errorMsg, disbaled, status, neId, visible, imgaeSrc, contractUrl, constractModal, visibleModal, historyVisible } = this.state
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
            <Col span={2}>
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button onClick={this.toExamineAfter.bind(this, '驳回')} type="primary" htmlType="submit">驳回</Button>
              </Form.Item>
            </Col>
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
                { this.contractElectron(userInfo, contractUrl, status)}
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
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={10}><Form.Item label="紧急联系人">{this.initValue(userInfo.emergencyContact)}</Form.Item></Col>
            <Col span={10}><Form.Item label="婚姻状况">{this.initValue(userInfo.maritalStatus)}</Form.Item></Col>
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
                <Button type="primary" disabled={disbaled} onClick={this.toExamineAfter.bind(this, '通过')}>通过</Button>
                <Button htmlType="button" onClick={this.goBack}>取消</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
            <Button onClick={this.handleBasicModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
          </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            <Button onClick={this.handleBasicModal.bind(this, 0)}>取消</Button>
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
        <HistoricalRecords name={userInfo.userName} visible={historyVisible} userId={neId} onCancel={this.historyVisibleModal}/>
      </div>
    )
  }
}

export default Form.create<PeopleInfoDetailProps>()(PeopleInfoDetail)
