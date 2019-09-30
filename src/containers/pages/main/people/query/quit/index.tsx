/**
 * @description 人员信息查看(已离职)
 * @author minjie
 * @createTime 2019/07/5
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import moment from 'moment'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col, Icon } from 'antd'

import SearchItem from '../components/SearchItem'
import { SysUtil, JudgeUtil } from '@utils/index'

import { Success, Errors, Info } from '@components/icon/BasicIcon'

interface PeopleQueryProps {
  history: any
}
interface PeopleQueryState {
  serachParam: any
}

export default class PeopleQuery extends RootComponent<PeopleQueryProps, PeopleQueryState> {
  // 暂时保存信息
  private serachParam:any = {}

  constructor (props:any) {
    super(props)
    let tableAry = SysUtil.getSessionStorage('query_quit_table_page') || {}
    let serachParam = {
      entryState: '离职'
    }
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
    }
    this.serachParam = serachParam
    this.state = {
      serachParam
    }
  }
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 查看 */
  queryDetail = (userId:any) => {
    this.props.history.push(`/home/people/detail/old/${userId}`)
  }

  /** 电子合同 */
  queryContract = (record:any) => {
    let { downloadContract, electronicContract, userId } = record
    SysUtil.setSessionStorage('contract-url', {
      downloadContract,
      electronicContract
    })
    this.props.history.push(`/home/people/query/contract/${userId}`)
  }

  /** 查询信息 */
  loadingData = () => {
    this.serachParam['entryState'] = '离职'
    this.setState({ serachParam: this.serachParam })
  }

  /** 设置查询的信息的值 */
  setSerachParam = (serachParam:any) => {
    this.serachParam = serachParam
  }

  render () {
    const columnData = [
      { title: '编号', width: 100, dataIndex: 'userId', key: 'userId' },
      { title: '姓名', width: 100, dataIndex: 'userName', key: 'userName' },
      { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
      {
        title: '合同主体',
        dataIndex: 'contractSubject',
        key: 'contractSubject',
        render: (text:string, record:any) => text || '- - -'
      },
      {
        title: '开户时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a:any, b:any) => {
          let at = new Date(a.createTime).getTime()
          let bt = new Date(b.createTime).getTime()
          if (at > bt) {
            return 1
          } else if (at < bt) {
            return -1
          } else {
            return 0
          }
        },
        render: (text:string, record:any) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{text ? time : '---'}</span>)
        }
      },
      {
        title: '已开通',
        dataIndex: 'openService',
        key: 'openService',
        render: (text:string) => text || '- - -'
      },
      {
        title: '当前状态',
        dataIndex: 'workCondition',
        key: 'workCondition',
        render: (text:string) => {
          if (text === '在职') {
            return <span><Icon component={Success}></Icon><span>{text}</span></span>
          } else if (text === '待入职') {
            return <span><Icon component={Info}></Icon><span>{text}</span></span>
          } else {
            return <span><Icon component={Errors}></Icon><span>{text}</span></span>
          }
        }
      },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          let electronicContract = record.electronicContract
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.queryDetail.bind(this, record.userId)}>查看</span>
              {JudgeUtil.isEmpty(electronicContract) ? <span className='cus-span-gray'>电子合同</span> : <span onClick={this.queryContract.bind(this, record)}>电子合同</span> }
            </div>
          )
        }
      }
    ]
    const { serachParam } = this.state
    return (
      <div style={{ margin: 19 }}>
        <Row><Col><SearchItem type="quit" serachParam={serachParam} setSerachParam={this.setSerachParam}></SearchItem></Col></Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            <Button type="primary" onClick={this.loadingData}>刷新</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="userId"
          sessionPageKey='query_quit_table_page'
          URL={this.api.queryQuery}
          searchParams={serachParam}
          columns={columnData}
        />
      </div>
    )
  }
}
