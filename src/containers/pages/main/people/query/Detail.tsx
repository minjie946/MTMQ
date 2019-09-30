/**
 * @description 人员信息查看详情/编辑
 * @author minjie
 * @createTime 2019/05/14
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal, ImgPreview } from '@components/index'
import { Form, Button, Row, Col, Divider, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from 'typings/global'
import moment from 'moment'

import { JudgeUtil, SysUtil, globalEnum } from '@utils/index'
import { userBankPNG, userGroupPNG, userInfoPNG, userShezhiPNG } from '@components/icon/BasicIcon'
import { PeopleNewModel } from './components/query'
import noimg from '@assets/images/icon/noimg.png'

import HistoricalRecords from './components/HistoricalRecords'

import './style/detail.styl'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}
interface PeopleInfoDetailProps extends BaseProps, FormComponentProps {
}

interface PeopleInfoDetailState {
  // 保存详情
  userInfo:PeopleNewModel
  neId: any // 用户编号
  errorMsg: string // 错误消息
  status:string // tab状态
  visible: boolean
  imgaeSrc: string
  contractUrl: string // 电子合同的URL
  constractModal: boolean // 电子合同的查看弹窗
  visibleModal: boolean // 消息提示的弹窗
  historyVisible: boolean // 历史记录的
}

class PeopleInfoDetail extends RootComponent<PeopleInfoDetailProps, PeopleInfoDetailState> {
  constructor (props:PeopleInfoDetailProps) {
    super(props)
    const { match } = this.props
    let ary = match.url.split('/')
    let neId = match.params.id || 0
    this.state = {
      userInfo: new PeopleNewModel(),
      neId,
      status: ary[ary.length - 2],
      errorMsg: '',
      visible: false,
      imgaeSrc: noimg,
      contractUrl: '',
      constractModal: false,
      visibleModal: false,
      historyVisible: false
    }
  }

  /** 初始加载数据 */
  componentDidMount () {
    const { neId, status } = this.state
    if (status === 'new') { // 查询详情
      this.getNewDetail(neId)
    } else if (status === 'old' || status === 'quit') {
      this.getDetail()
      this.getConstract(neId)
    }
  }

  /** 获取待入职用户的信息 */
  getNewDetail = (neId:any) => {
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.queryNewDetail, {
      neId: neId,
      userId
    }).then(({ data }:any) => {
      this.setState({ userInfo: data })
      if (data && data.userId) {
        this.getConstract(data.userId)
      }
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 获取电子合同 */
  getConstract = (userId: number) => {
    this.axios.request(this.api.queryContractUrl, { userId }).then((res:any) => {
      const { data } = res
      this.setState({ contractUrl: data })
    }).catch((err:any) => {
      console.log(err.msg || err)
    })
  }

  // 获取已入职和已离职详情
  getDetail = () => {
    const { neId } = this.state
    this.axios.request(this.api.queryDetail, {
      userId: neId
    }).then(({ data }:any) => {
      this.setState({ userInfo: data })
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 返回上一个界面 */
  goBack = () => {
    const { status } = this.state
    this.props.history.replace(`/home/people/query?type=${status || 'new'}`)
  }

  initValue = (value:any) => {
    return JudgeUtil.isEmpty(value) ? '---' : value
  }

  initValueInput = (value:any) => {
    return JudgeUtil.isEmpty(value) ? undefined : value
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 户籍  */
  nativePlaceCountry = (userInfo:any) => {
    // 户籍-省 户籍-市 户籍-县 户籍-详细地址
    let { nativePlaceCountry, nativePlaceProvince, nativePlaceCity, nativePlaceCounty, nativePlaceDetail } = userInfo
    let ary:Array<string> = []
    if (nativePlaceProvince) ary.push(nativePlaceProvince)
    if (nativePlaceCity) ary.push(nativePlaceCity)
    if (nativePlaceCounty) ary.push(nativePlaceCounty)
    if (nativePlaceDetail) ary.push(nativePlaceDetail)
    if (ary.length === 0) {
      return '---'
    } else {
      return ary.join('-')
    }
  }

  /** 联系地址  */
  nowPlaceCountry = (userInfo:any) => {
    // 现住址-省 现住址-市 现住址-县 现住址-详细地址
    let { nowPlaceProvince, nowPlaceCity, nowPlaceCounty, nowPlaceDetail } = userInfo
    let ary:Array<string> = []
    if (nowPlaceProvince) ary.push(nowPlaceProvince)
    if (nowPlaceCity) ary.push(nowPlaceCity)
    if (nowPlaceCounty) ary.push(nowPlaceCounty)
    if (nowPlaceDetail) ary.push(nowPlaceDetail)
    if (ary.length === 0) {
      return '---'
    } else {
      return ary.join('-')
    }
  }

  /** 显示组织的信息 */
  initUserOrganize = (value:any) => {
    return JudgeUtil.isEmpty(value) ? undefined : value.split('-')
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
      if (status === 'new') {
        if (JudgeUtil.isEmpty(contractUrl)) {
          return ecName
        } else {
          return <Button type="link" onClick={this.constractModalShow.bind(this, true)}>{ecName}</Button>
        }
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
  }

  render () {
    const { userInfo, contractUrl, constractModal, neId } = this.state
    const { errorMsg, status, visible, imgaeSrc, visibleModal, historyVisible } = this.state
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
            <div className='people-detail-btn-content btn-inline-group'>
              <Form.Item labelCol={{ span: 0 }} wrapperCol={{ span: 24 }}>
                <Button htmlType="button" onClick={this.goBack}>返回</Button>
              </Form.Item>
            </div>
          </Row>
          <Row><Col span={21}><Divider className='people-detail-divider'/></Col></Row>
          <Row>
            <Col span={12}><Form.Item label={status === 'new' ? '创建时间' : '注册时间'}>{this.initValue(userInfo.createTime)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={12}><Form.Item label="数据来源">{this.initValue(userInfo.userDataSources)}</Form.Item></Col>
            <Col span={12}><Form.Item label="系统ID">{this.initValue(userInfo.userId)}</Form.Item></Col>
          </Row>
          <Row>
            {/* 待入职 在职 离职 */}
            <Col span={12}><Form.Item label="工作状态">{this.initValue(userInfo.workCondition)}</Form.Item></Col>
            {
              status === 'new' &&
              <Col span={12}><Form.Item label="入职状态">{textAry.length > 0 ? textAry.join('/') : '---'}</Form.Item></Col>
            }
          </Row>
          <Row>
            <Col span={12}><Form.Item label="开通模块">{this.initValue(userInfo.openService)}</Form.Item></Col>
            <Col span={12}>
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
            <Col span={12}>
              <Form.Item label="用户姓名">
                {this.initValue(userInfo.userName)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="手机号">
                {this.initValue(userInfo.phoneNumber)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}><Form.Item label="性别">{this.initValue(userInfo.sex)}</Form.Item></Col>
            <Col span={12}><Form.Item label="身份证号">{this.initValue(userInfo.idCard)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={12}><Form.Item label="年龄">{this.initValue(userInfo.userAge)}</Form.Item></Col>
            <Col span={12}><Form.Item label="户籍">{this.initPlaceCountry()}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="项目">
                {this.initValue(userInfo.projectName)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="薪资">
                {this.initValue(userInfo.maxSalary)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="部门" className="cus-select-autowidth">
                {this.initValue(userInfo.userOrganize)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="合同主体" className="cus-select-autowidth-240">
                {this.initValue(userInfo.contractSubject)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="岗位名称">
                {this.initValue(userInfo.postName)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="合同类型">
                {this.initValue(userInfo.contractType)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="电子合同">
                {this.contractElectron(userInfo, contractUrl, status)}
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
            <Col span={12}><Form.Item label="绑定银行卡">{this.initValue(userInfo.bankCardId)}</Form.Item></Col>
            <Col span={12}><Form.Item label="所属银行">{this.initValue(userInfo.bankName)}</Form.Item></Col>
          </Row>
          {/** 补充信息 */}
          <Row>
            <Col span={21}>
              <img className='cus-item people-icon-shezhi' src={userInfoPNG} />
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
                <p>毕业证</p>
              </div>
            </Col>
            <Col span={6}>
              <div className='people-icon-picture'>
                {
                  !JudgeUtil.isEmpty(userInfo.hkbUrl)
                    ? <img src={userInfo.hkbUrl} onClick={this.imgPreviewVsibale.bind(this, 1, userInfo.hkbUrl || noimg)}/>
                    : <div className='content'>户口本</div>
                }
                <p>户口本</p>
              </div>
            </Col>
            <Col span={6}>
              <div className='people-icon-picture'>
                {
                  !JudgeUtil.isEmpty(userInfo.tgdUrl)
                    ? <img src={userInfo.tgdUrl} onClick={this.imgPreviewVsibale.bind(this, 1, userInfo.tgdUrl || noimg)}/>
                    : <div className='content'>退工单</div>
                }
                <p>退工单</p>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={12}><Form.Item label="紧急联系人">{this.initValue(userInfo.emergencyContact)}</Form.Item></Col>
            <Col span={12}><Form.Item label="婚姻状况">{this.initValue(userInfo.maritalStatus)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={12}><Form.Item label="紧急联系人电话">{this.initValue(userInfo.emergencyPhone)}</Form.Item></Col>
            <Col span={12}><Form.Item label="户口性质">{this.initValue(userInfo.houseRegisterType)}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={12}><Form.Item label="紧急联系人关系">{this.initValue(userInfo.emergencyRelation)}</Form.Item></Col>
            <Col span={12}><Form.Item label="联系地址">{userInfo.nowPlaceProvince + userInfo.nowPlaceCity + userInfo.nowPlaceCounty + userInfo.nowPlaceDetail || '---'}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={12}><Form.Item label="最高学历">{this.initValue(userInfo.highestDegree)}</Form.Item></Col>
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
