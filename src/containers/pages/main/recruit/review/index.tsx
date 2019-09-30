/**
 * @description 简历审核
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal, Progress } from '@components/index'
import { Button, Row, Col, Tabs } from 'antd'
import { BaseProps } from 'typings/global'
import { SysUtil, JudgeUtil, globalEnum } from '@utils/index'
import moment from 'moment'
import SearchItem from './components/SearchItem'
import Interview from './components/Interview'
import Offer from './components/offer'

const { TabPane } = Tabs

enum StuatsEnum {
  /** 全部 */
  all = '',
  /** 待入职 */
  waitingForEntry = '待入职',
  /** 不合适 */
  inappropriate = '不合适',
  /** 已报名 */
  enrolment = '已报名',
  /** 待面试 */
  toBeInterviewed = '待面试',
  /** 已入职 */
  entry = '已入职'
}

interface PostPageProps extends BaseProps {
}

interface PostPageState {
  // 搜索的条件
  serachParam: any
  // 错误的消息
  errorMsg:string
  // 投递的ID
  deliveryId:number
  // 重新刷新
  reLoadingStatus: boolean
  visibleModal: boolean
  visibleOffer: boolean
  visibleInterview: boolean
  ratio: any
  defaultActiveKey: StuatsEnum
  activeKey: StuatsEnum
  resumeState: StuatsEnum
}

export default class PostPage extends RootComponent<PostPageProps, PostPageState> {
  private serachParamData:any = {}
  deliveryId: number = -1
  // 保存弹窗的状态
  handleModalKey:number = -1

  constructor (props:PostPageProps) {
    super(props)
    let tableAry = SysUtil.getSessionStorage('review_table_page') || {}
    let serachParam = {}
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      this.serachParamData = serachParam
    }
    let defaultActiveKey = StuatsEnum.all
    this.state = {
      serachParam,
      errorMsg: '',
      deliveryId: -1,
      reLoadingStatus: false,
      visibleModal: false,
      visibleOffer: false,
      visibleInterview: false,
      ratio: {},
      defaultActiveKey,
      activeKey: defaultActiveKey,
      resumeState: defaultActiveKey
    }
  }

  componentDidMount () {
    this.initReviewRatio()
  }

  initReviewRatio = () => {
    this.axios.request(this.api.reviewRatio).then((res:any) => {
      this.setState({ ratio: res.data })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingTableData = () => {
    this.serachParamData['resumeState'] = this.state.resumeState
    this.setState({ serachParam: this.serachParamData })
  }

  /** 重载之后 */
  onReLoadingStatus = (reLoadingStatus: boolean) => {
    this.setState({ reLoadingStatus })
  }

  /** 发送面试邀请 */
  toInterview = ({ deliveryId }:any) => {
    this.setState({ deliveryId })
    this.visibleInterviewModal(true)
  }

  /** 发送Offer */
  toOffer = ({ deliveryId }:any) => {
    this.setState({ deliveryId })
    this.visibleOfferModal(true)
  }

  /** 去详情的界面 */
  postDetail = ({ deliveryId }:any) => {
    this.props.history.push(`/home/recruit/review/detail/${deliveryId}`)
  }

  /** 不合适 之前的提示 */
  postNoAfter = ({ deliveryId }:any) => {
    this.setState({ errorMsg: `确认拒绝该用户的简历？`, deliveryId })
    this.handleModalKey = 2 // 拒绝用户
    this.handleModal(1)
  }

  /** 不合适 */
  postNo = () => {
    this.axios.request(this.api.reviewNo, {
      deliveryId: this.state.deliveryId,
      userId: SysUtil.getLocalStorage(globalEnum.userID)
    }).then((res:any) => {
      this.$message.success('拒绝成功！')
      this.handleModalKey = -1
      this.loadingTableData()
    }).catch((err:any) => {
      let { msg } = err
      this.setState({ errorMsg: msg || err })
      this.handleModalKey = 0
      this.handleModal(1)
    })
  }

  /** 删除的提示 */
  handleModal = (num:number) => {
    if (num === 2) { // 不合适
      this.postNo()
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 发送面试邀请 */
  visibleInterviewModal = (visibleInterview: boolean) => {
    if (!visibleInterview) {
      this.loadingTableData()
      this.setState({ deliveryId: -1 })
    }
    this.setState({ visibleInterview })
  }

  /** 发送offer */
  visibleOfferModal = (visibleOffer: boolean) => {
    if (!visibleOffer) {
      this.loadingTableData()
      this.setState({ deliveryId: -1 })
    }
    this.setState({ visibleOffer })
  }

  /** tabs 改变的时候进行切换 */
  tabsChange = (activeKey:any) => {
    this.serachParamData['resumeState'] = activeKey
    this.setState({ activeKey, resumeState: activeKey, serachParam: this.serachParamData })
  }

  render () {
    const { serachParam, errorMsg, deliveryId, reLoadingStatus, visibleModal, activeKey, defaultActiveKey } = this.state
    const { visibleInterview, visibleOffer, ratio } = this.state
    const columnData = [
      { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
      { title: '隶属架构', dataIndex: 'organize', key: 'organize' },
      {
        title: '投递时间',
        dataIndex: 'deliveryTime',
        key: 'deliveryTime',
        render: (text:string, record:any) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{time}</span>)
        }
      },
      {
        title: '电子面试',
        dataIndex: 'whetherElectronInterview',
        key: 'whetherElectronInterview',
        render: (text:string) => {
          return text === '未完成' ? '无' : '有'
        }
      },
      { title: '性别', dataIndex: 'sex', key: 'sex' },
      { title: '年龄', dataIndex: 'age', key: 'age' },
      { title: '地区', dataIndex: 'area', key: 'area' },
      { title: '投递人手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
      {
        title: '状态',
        dataIndex: 'resumeState',
        key: 'resumeState',
        width: 80,
        render: (text:string) => {
          // 待入职 不合适 已报名 待面试
          if (text === '待入职') {
            return <span className='cus-lable-info'>待入职</span>
          } else if (text === '不合适') {
            return <span className='cus-lable-error'>不合适</span>
          } else if (text === '已报名') {
            return <span className='cus-lable-waring'>已报名</span>
          } else if (text === '待面试') {
            return <span className='cus-lable-info'>待面试</span>
          } else if (text === '已入职') {
            return <span className='cus-lable-success'>已入职</span>
          } else {
            return <span className='cus-lable-info'>{text}</span>
          }
        }
      },
      {
        title: '操作',
        key: 'tags',
        width: 200,
        render: (text:string, record:any) => {
          const { resumeState } = record
          let flg = (resumeState === '已报名' || resumeState === '待面试')
          return (
            <div className="btn-inline-group">
              <span className='cus-lable-info' onClick={this.postDetail.bind(this, record)}>查看</span>
              {flg ? <span className='cus-lable-info' onClick={this.toInterview.bind(this, record)}>发通知</span> : <span className='cus-span-gray'>发通知</span>}
              {flg ? <span className='cus-lable-waring' onClick={this.postNoAfter.bind(this, record)}>不合适</span> : <span className='cus-span-gray'>不合适</span>}
              {flg ? <span className='cus-lable-success' onClick={this.toOffer.bind(this, record)}>录用</span> : <span className='cus-span-gray'>录用</span>}
            </div>
          )
        }
      }
    ]

    const { enroll, interview, waitEntry, improper, alreadyEntry, sum } = ratio
    let enrollNum = enroll ? JudgeUtil.toFixed((enroll / sum * 100).toString()) : 0
    let interviewNum = interview ? JudgeUtil.toFixed((interview / sum * 100).toString()) : 0
    let waitEntryNum = waitEntry ? JudgeUtil.toFixed((waitEntry / sum * 100).toString()) : 0
    let improperNum = improper ? JudgeUtil.toFixed((improper / sum * 100).toString()) : 0
    let alreadyEntryNum = alreadyEntry ? JudgeUtil.toFixed((alreadyEntry / sum * 100).toString()) : 0
    const successPercent:any = [
      { value: enrollNum, title: `已报名 ${enrollNum} %` },
      { value: interviewNum, title: `待面试 ${interviewNum} %` },
      { value: improperNum, title: `不合适 ${improperNum} %` },
      { value: waitEntryNum, title: `待入职 ${waitEntryNum} %` },
      { value: alreadyEntryNum, title: `已入职 ${alreadyEntryNum} %` }
    ]
    return (
      <div className="card-container">
        <Tabs type="card" onChange={this.tabsChange} activeKey={activeKey} defaultActiveKey={defaultActiveKey}>
          <TabPane tab="全部" key={StuatsEnum.all}/>
          <TabPane tab="待入职" key={StuatsEnum.waitingForEntry}/>
          <TabPane tab="不合适" key={StuatsEnum.inappropriate}/>
          <TabPane tab="已报名" key={StuatsEnum.enrolment}/>
          <TabPane tab="待面试" key={StuatsEnum.toBeInterviewed}/>
          <TabPane tab="已入职" key={StuatsEnum.entry}/>
        </Tabs>
        <div className='cus-home-card-content'>
          <Row>
            <Col><SearchItem serachParam={serachParam} getSerachParam={this.getSerachParam}/></Col>
          </Row>
          <Row className="search-btn btn-inline-group">
            <Col>
              <Button type="primary" onClick={this.loadingTableData}>查询</Button>
              <Button type="primary" onClick={this.loadingTableData}>刷新</Button>
            </Col>
          </Row>
          <Row style={{ marginBottom: '10px' }}>
            <Progress successPercent={successPercent}></Progress>
          </Row>
          <TableItem
            rowSelectionFixed
            rowSelection={false}
            rowKey="deliveryId"
            sessionPageKey='review_table_page'
            reLoadingStatus={reLoadingStatus}
            onReLoadingStatus={this.onReLoadingStatus}
            URL={this.api.reviewQuery}
            searchParams={serachParam}
            columns={columnData}
          />
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
          {/** 发送面试邀请 */}
          <Interview deliveryId={deliveryId} visible={visibleInterview} onCancel={this.visibleInterviewModal}/>
          {/** 发送offer */}
          <Offer deliveryId={deliveryId} visible={visibleOffer} onCancel={this.visibleOfferModal}/>
        </div>
      </div>
    )
  }
}
