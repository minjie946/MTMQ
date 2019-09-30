/**
 * @description 预支-全部
 * @author maqian
 * @createTime 2019/07/11
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { SysUtil, globalEnum } from '@utils/index'
import { Button, Row, Col, Icon } from 'antd'
import { Info, Success } from '@components/icon/BasicIcon'
import { RootComponent, TableItem, ExcelFileImport } from '@components/index'

import SearchItem from '../components/SearchItem'
import AllDetailItem from './detail'

interface AdvanceAllPageProps {
  history: any
}

interface AdvanceAllPageState {
  serachParam:any
  visible:boolean
  deliveryId: number
  type: 'detail' | 'Approval',
  createUser: number
}

export default class AdvanceAllPage extends RootComponent<AdvanceAllPageProps, AdvanceAllPageState> {
  // 创建弹框对象
  private serachParamData:any = {}
  constructor (props:AdvanceAllPageProps) {
    super(props)
    let createUser = SysUtil.getLocalStorage(globalEnum.userID) || 0
    this.state = {
      visible: false,
      serachParam: {},
      type: 'detail',
      deliveryId: -1,
      createUser
    }
  }

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingData = () => {
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
  /** 弹窗的开关 */
  handleModel = (visible:boolean) => {
    if (!visible) {
      this.loadingData()
      this.setState({ deliveryId: -1 })
    }
    this.setState({ visible })
  }

  render () {
    const columnData = [
      { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
      { title: '隶属架构', dataIndex: 'organize', key: 'organize' },
      { title: '提佣人', dataIndex: 'commissionUserName', key: 'commissionUserName' },
      { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
      { title: '创建时间', dataIndex: 'deliveryTime', key: 'deliveryTime' },
      {
        title: '订单状态',
        dataIndex: 'orderStatus',
        key: 'orderStatus',
        render: (text:string) => {
          if (text === '已投递') {
            return <span><Icon component={Info} className='cus-item'></Icon><span>{text}</span></span>
          } else if (text === '已面试') {
            return <span><Icon component={Info} className='cus-item'></Icon><span>{text}</span></span>
          } else if (text === '待入职') {
            return <span><Icon component={Info} className='cus-item'></Icon><span>{text}</span></span>
          } else if (text === '已关闭') {
            return <span><Icon component={Info} className='cus-item'></Icon><span>{text}</span></span>
          } else if (text === '已入职') {
            return <span><Icon component={Success} className='cus-item'></Icon><span>{text}</span></span>
          }
        }
      },
      {
        title: '佣金状态',
        dataIndex: 'moneyStatus',
        key: 'moneyStatus',
        render: (text:string) => {
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
        render: (text:string, record:any) => {
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.toDetail.bind(this, record)}>查看</span>
              <span onClick={this.toApproval.bind(this, record)}>审批</span>
            </div>
          )
        }
      }
    ]
    const { serachParam, visible, type, deliveryId, createUser } = this.state
    return (
      <div className='cus-home-content'>
        <Row>
          <Col><SearchItem getSerachParam={this.getSerachParam}/></Col>
        </Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            <Button type="primary" onClick={this.loadingData}>刷新</Button>
            <ExcelFileImport params={{ createUser }} action={this.api.queryImport.path}>
              <Button type="primary">批量新建导入</Button>
            </ExcelFileImport>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="deliveryId"
          URL={this.api.postQuery}
          searchParams={serachParam}
          columns={columnData}
        />
        <AllDetailItem deliveryId={deliveryId} type={type} visible={visible} onCancel={this.handleModel} />
      </div>
    )
  }
}
