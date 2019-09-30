/**
 * @description 晋升通道
 * @author maqian
 * @createTime 2019/07/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col } from 'antd'

import SearchItem from './components/SearchItem'
import { SysUtil } from '@utils/index'

interface AdvanceAllPageProps {
  history: any
}

interface AdvanceAllPageState {
  serachParam:any
  templateId: number
}

export default class AdvanceAllPage extends RootComponent<AdvanceAllPageProps, AdvanceAllPageState> {
  // 创建弹框对象
  private serachParamData:any = {}
  constructor (props:AdvanceAllPageProps) {
    super(props)
    let tableAry = SysUtil.getSessionStorage('promotion_table_page') || {}
    let serachParam = {}
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      this.serachParamData = serachParam
    }
    this.state = {
      serachParam,
      templateId: 0
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
  /** 编辑的界面 */
  postEdit = ({ templateId }:any) => {
    this.setState({ templateId })
    this.props.history.push(`/home/company/promotionDetail?type=edit&templateId=${templateId}`)
  }
  // 新增页面
  postAdd = () => {
    this.setState({ templateId: -1 })
    this.props.history.push('/home/company/promotionDetail?type=add')
  }

  render () {
    const columnData = [
      { title: '模板名称', dataIndex: 'templateName', key: 'templateName' },
      {
        title: '包含岗位名称',
        dataIndex: 'containedPostNames',
        key: 'containedPostNames',
        render: (text:any) => (<span>{text.join('、') + ' '}</span>)
      },
      { title: '最后修改时间', dataIndex: 'lastUpdateTime', key: 'lastUpdateTime' },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.postEdit.bind(this, record)}>编辑</span>
            </div>
          )
        }
      }
    ]
    const { serachParam } = this.state
    return (
      <div className='cus-home-content'>
        <Row>
          <Col><SearchItem serachParam={serachParam} getSerachParam={this.getSerachParam}/></Col>
        </Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            <Button type="primary" onClick={this.loadingData}>刷新</Button>
            <Button type="primary" onClick={this.postAdd}>新增</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="templateId"
          sessionPageKey='promotion_table_page'
          URL={this.api.PromotionQuery}
          searchParams={serachParam}
          columns={columnData}
        />
      </div>
    )
  }
}
