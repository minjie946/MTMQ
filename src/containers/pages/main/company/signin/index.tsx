/**
 * @description 签到管理
 * @author minjie
 * @createTime 2019/08/26
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'
import SearchItem from './components/SearchItem'
import { BaseProps } from '@typings/global'
import { SysUtil, globalEnum } from '@utils/index'
import SigninHistroy from './components/SigninHistroy'

import './style/index.styl'

interface CompanyInformationProps extends BaseProps {
  mobxCommon:any
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
  visibleAll: boolean
}

export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    this.state = {
      serachParam: {},
      visibleAll: false
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

  /** 查看所有的显示 */
  visibleAllModal = (visibleAll: boolean, record?:any) => {
    this.setState({ visibleAll })
  }

  render () {
    const { serachParam, visibleAll } = this.state
    const columnData = [
      { title: '账号姓名', dataIndex: 'projectName', key: 'projectName' },
      { title: '手机号', dataIndex: 'status', key: 'status' },
      { title: '最新签到时间', dataIndex: 'connectionUser', key: 'connectionUser' },
      { title: '地点', dataIndex: 'phoneNumber', key: 'phoneNumber' },
      {
        title: '手机型号',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text:string, record:any) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{time}</span>)
        }
      },
      {
        title: '操作',
        key: 'tags',
        render: (text:any, record:any) => {
          return <div className="span-link">
            <span onClick={this.visibleAllModal.bind(this, true, record)}>查看所有</span>
          </div>
        }
      }
    ]
    return (
      <div style={{ backgroundColor: '#edefef' }}>
        <div className='cus-home-content' style={{ marginBottom: 24, backgroundColor: '#fff' }}>
          <Row>
            <Col span={5} offset={1} className='signin-count-content'>
              <p className='one'><span>今日</span>签到人数</p>
              <p className='two'><span>6000</span>人</p>
            </Col>
            <Col span={5} className='signin-count-content'>
              <p className='one'><span>本周</span>签到人数</p>
              <p className='two'><span>6000</span>人</p>
            </Col>
            <Col span={5} className='signin-count-content'>
              <p className='one'><span>本月</span>签到人数</p>
              <p className='two'><span>6000</span>人</p>
            </Col>
          </Row>
        </div>
        <div className='cus-home-content' style={{ backgroundColor: '#fff' }}>
          <Row>
            <Col><SearchItem getSerachParam={this.getSerachParam}/></Col>
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
            rowKey="rechargeRecordId"
            URL={this.api.signinQuery}
            searchParams={serachParam}
            columns={columnData}
          />
          <SigninHistroy visible={visibleAll} onCancel={this.visibleAllModal}/>
        </div>
      </div>
    )
  }
}
