/**
 * @description 消息推送
 * @author minjie
 * @createTime 2019/08/06
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col, Popover } from 'antd'
import moment from 'moment'
import SearchItem from './components/SearchItem'
import { BaseProps } from '@typings/global'
import { SysUtil } from '@utils/index'
import { returnStr } from '@shared/index'

interface CompanyInformationProps extends BaseProps {
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
}

export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    let tableAry = SysUtil.getSessionStorage('messagepush_table_page') || {}
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

  /** 去新增 */
  toadd = () => {
    this.props.history.push('/home/company/messagepush/add')
  }

  /** 编辑 */
  toUpdate = ({ pushMessageId }:any) => {
    this.props.history.push(`/home/company/messagepush/update/${pushMessageId}`)
  }

  /** 详情 */
  todetail = ({ pushMessageId }:any) => {
    this.props.history.push(`/home/company/messagepush/detail/${pushMessageId}`)
  }

  render () {
    const { serachParam } = this.state
    const columnData = [
      { title: '标题', dataIndex: 'pushMessageTitle', key: 'pushMessageTitle' },
      {
        title: '内容',
        dataIndex: 'pushMessageContent',
        key: 'pushMessageContent',
        render: (text:string) => {
          let tx = text.length > 10 ? text.substring(0, 10) + '...' : text
          return (<Popover getPopupContainer={(triggerNode:any) => triggerNode.parentElement} placement="topLeft"
            overlayStyle={{ width: 400 }} title={'内容'} content={text}>
            <span>{tx}</span>
          </Popover>)
        }
      },
      { title: '链接', dataIndex: 'pushPath', key: 'pushPath' },
      { title: '创建人', width: 90, dataIndex: 'author', key: 'author' },
      {
        title: '所属项目',
        width: 90,
        dataIndex: 'projectName',
        key: 'projectName',
        render: (text:string) => {
          return (<span>{text ? returnStr(text) : '---'}</span>)
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 140,
        render: (text:string) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{time}</span>)
        }
      },
      { title: '推送量', width: 90, dataIndex: 'pushCount', key: 'pushCount' },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 140,
        render: (record:any) => {
          return <div className="btn-inline-group span-link">
            <span onClick={this.toUpdate.bind(this, record)}>编辑</span>
            <span onClick={this.todetail.bind(this, record)}>查看</span>
          </div>
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
            <Button type="primary" onClick={this.toadd}>新增</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="pushMessageId"
          sessionPageKey='messagepush_table_page'
          URL={this.api.messagePushQuery}
          searchParams={serachParam}
          columns={columnData}
        />
      </div>
    )
  }
}
