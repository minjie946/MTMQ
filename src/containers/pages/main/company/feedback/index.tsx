/**
 * @description 意见反馈
 * @author minjie
 * @createTime 2019/06/21
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'

import SearchItem from './components/SearchItem'

import { BaseProps } from '@typings/global'
import { JudgeUtil, SysUtil } from '@utils/index'

interface CompanyInformationProps extends BaseProps {
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
}

export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    let tableAry = SysUtil.getSessionStorage('feedback_table_page') || {}
    let serachParam = {}
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      this.serachParamData = serachParam
    }
    this.state = {
      serachParam
    }
  }
  private serachParamData:any = {}

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingTableData = () => {
    this.setState({ serachParam: this.serachParamData })
  }

  /** 去详情的界面 */
  toDetail = ({ feedbackId }:any) => {
    this.props.history.push(`/home/company/feedback/reply/${feedbackId}`)
  }

  render () {
    const { serachParam } = this.state
    const columnData = [
      { title: '姓名', dataIndex: 'feedbackerName', key: 'feedbackerName' },
      { title: '手机号', dataIndex: 'feedbackerPhone', key: 'feedbackerPhone' },
      {
        title: '反馈平台',
        dataIndex: 'feedbackDevice',
        key: 'feedbackDevice',
        render: (text:string) => {
          return text ? <span>{text}</span> : '- - -'
        }
      },
      { title: '反馈类型', dataIndex: 'feedbackType', key: 'feedbackType' },
      {
        title: '创建时间',
        dataIndex: 'feedbackTime',
        key: 'feedbackTime',
        render: (text:string, record:any) => {
          return (<span>{!JudgeUtil.isEmpty(text) ? moment(text).format('YYYY-MM-DD HH:mm') : null}</span>)
        }
      },
      {
        title: '是否已答复',
        dataIndex: 'feedbackState',
        key: 'feedbackState',
        render: (text:string, record:any) => {
          return text ? (<span className='cus-lable-success'>是</span>) : (<span className='cus-lable-waring'>否</span>)
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text:string, record:any) => {
          return (<span>{!JudgeUtil.isEmpty(text) ? moment(text).format('YYYY-MM-DD HH:mm') : null}</span>)
        }
      },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          let { systemStatus } = record
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.toDetail.bind(this, record)}>答复</span>
            </div>
          )
        }
      }
    ]
    return (
      <div className='cus-home-content'>
        <Row>
          <Col><SearchItem serachParam={serachParam} getSerachParam={this.getSerachParam}/></Col>
        </Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingTableData}>查询</Button>
            <Button type="primary" onClick={this.loadingTableData}>刷新</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="feedbackId"
          sessionPageKey='feedback_table_page'
          URL={this.api.feedbackQuery}
          searchParams={serachParam}
          columns={columnData}
        />
      </div>
    )
  }
}
