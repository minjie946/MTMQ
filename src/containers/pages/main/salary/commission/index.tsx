/**
 * @description 佣金
 * @author minjie
 * @createTime 2019/06/25
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Info, Success } from '@components/icon/BasicIcon'
import { Button, Row, Col, Icon, Tabs } from 'antd'

import SearchItem from './components/SearchItem'
import DetailItem from './detail'

import { BaseProps } from '@typings/global'
import { SysUtil } from '@utils/index'

import EmailHistory from './components/EmailHistory'

const { TabPane } = Tabs

enum StuatsEnum {
  /** 全部 */
  all = '',
  /** 已投递 */
  delivered = '已投递',
  /** 已面试 */
  interviewed = '已面试',
  /** 待入职 */
  waitingForEntry = '待入职',
  /** 已入职 */
  entry = '已入职',
  /** 已关闭 */
  closed = '已关闭',
  /** 已结算 */
  settled = '已结算'
}

interface CompanyInformationProps extends BaseProps {
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
  // Model 状态
  visible: boolean
  deliveryId: number
  type: 'detail' | 'Approval'
  visibleHistory: boolean
  defaultActiveKey: StuatsEnum
  activeKey: StuatsEnum
  orderStatus: StuatsEnum
}

export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    let tableAry = SysUtil.getSessionStorage('commission_table_page') || {}
    let serachParam:any = {}
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
    }
    let defaultActiveKey = StuatsEnum.all
    this.state = {
      visible: false,
      serachParam,
      deliveryId: -1,
      type: 'detail',
      visibleHistory: false,
      defaultActiveKey,
      activeKey: defaultActiveKey,
      orderStatus: defaultActiveKey
    }
  }
  private serachParamData:any = {}

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingData = () => {
    this.serachParamData['orderStatus'] = this.state.orderStatus
    this.setState({ serachParam: this.serachParamData })
  }

  /** 去详情的界面 */
  toDetail = ({ deliveryId }:any) => {
    this.setState({ type: 'detail', deliveryId })
    this.handleModel(true)
  }

  /** 去详情的界面 */
  toApproval = ({ deliveryId }:any) => {
    this.setState({ type: 'Approval', deliveryId })
    this.handleModel(true)
  }

  /** 去设置佣金费 */
  toCommissionSettings = () => {
    this.props.history.push('/home/recruit/post')
  }

  /** 弹窗的开关 */
  handleModel = (visible:boolean) => {
    if (!visible) {
      this.loadingData()
      this.setState({ deliveryId: -1 })
    }
    this.setState({ visible })
  }

  /** 打开发送的邮件的历史记录 */
  visibleHistoryModal = (visibleHistory: boolean) => {
    this.setState({ visibleHistory })
  }

  /** tabs 改变的时候进行切换 */
  tabsChange = (activeKey:any) => {
    this.serachParamData['orderStatus'] = activeKey
    this.setState({ activeKey, orderStatus: activeKey, serachParam: this.serachParamData })
  }

  render () {
    const { serachParam, visible, type, deliveryId, visibleHistory, activeKey, defaultActiveKey } = this.state
    const columnData = [
      { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
      { title: '隶属架构', dataIndex: 'organize', key: 'organize' },
      { title: '应聘人', dataIndex: 'deliveryUserName', key: 'deliveryUserName' },
      { title: '应聘人手机号', dataIndex: 'deliveryPhoneNumber', key: 'deliveryPhoneNumber' },
      { title: '提佣人', dataIndex: 'commissionUserName', key: 'commissionUserName' },
      { title: '提佣人手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
      { title: '创建时间', dataIndex: 'deliveryTime', key: 'deliveryTime' },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (text:string) => {
          if (text === '已结算') {
            return <span><Icon component={Success}></Icon><span>{text}</span></span>
          } else if (text === '已面试') {
            return <span><Icon component={Info}></Icon><span>{text}</span></span>
          } else if (text === '待入职') {
            return <span><Icon component={Info}></Icon><span>{text}</span></span>
          } else if (text === '已关闭') {
            return <span><Icon component={Info}></Icon><span>{text}</span></span>
          } else if (text === '已入职') {
            return <span><Icon component={Success}></Icon><span>{text}</span></span>
          } else if (text === '已投递') {
            return <span><Icon component={Info}></Icon><span>{text}</span></span>
          } else {
            return <span><Icon component={Info}></Icon><span>{text}</span></span>
          }
        }
      },
      {
        title: '佣金状态',
        dataIndex: 'moneyStatus',
        key: 'moneyStatus',
        render: (text:string, record:any) => {
          if (text === '已派发') {
            return (<span className='cus-lable-gray'>{text}</span>)
          } else {
            return (<span className='cus-lable-waring'>{text}</span>)
          }
        }
      },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 120,
        render: (text:string, record:any) => {
          let { moneyStatus, orderStatus } = record
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.toDetail.bind(this, record)}>查看</span>
              {moneyStatus !== '已派发' && orderStatus !== '已关闭' && orderStatus !== '已结算' ? <span onClick={this.toApproval.bind(this, record)}>审批</span> : <span className='cus-span-gray' >审批</span>}
            </div>
          )
        }
      }
    ]
    return (
      <div className="card-container">
        <Tabs type="card" onChange={this.tabsChange} activeKey={activeKey} defaultActiveKey={defaultActiveKey}>
          <TabPane tab="全部" key={StuatsEnum.all}/>
          <TabPane tab="已投递" key={StuatsEnum.delivered}/>
          <TabPane tab="已面试" key={StuatsEnum.interviewed}/>
          <TabPane tab="待入职" key={StuatsEnum.waitingForEntry}/>
          <TabPane tab="已入职" key={StuatsEnum.entry}/>
          <TabPane tab="已关闭" key={StuatsEnum.closed}/>
          <TabPane tab="已结算" key={StuatsEnum.settled}/>
        </Tabs>
        <div className='cus-home-card-content'>
          <Row>
            <Col><SearchItem serachParam={serachParam} getSerachParam={this.getSerachParam}/></Col>
          </Row>
          <Row className="search-btn btn-inline-group">
            <Col span={21}>
              <Button type="primary" onClick={this.loadingData}>查询</Button>
              <Button type="primary" onClick={this.loadingData}>刷新</Button>
              <Button type="primary" onClick={this.toCommissionSettings}>佣金费设置</Button>
            </Col>
            <Col span={3}>
              <Button type="primary" onClick={this.visibleHistoryModal.bind(this, true)}>查看历史记录</Button>
            </Col>
          </Row>
          <TableItem
            rowSelectionFixed
            rowSelection={false}
            rowKey="deliveryId"
            sessionPageKey='commission_table_page'
            URL={this.api.commissionQuery}
            scroll={{ x: 1200 }}
            searchParams={serachParam}
            columns={columnData}
          />
        </div>
        <DetailItem deliveryId={deliveryId} type={type} visible={visible} onCancel={this.handleModel} />
        <EmailHistory visible={visibleHistory} onCancel={this.visibleHistoryModal}/>
      </div>
    )
  }
}
