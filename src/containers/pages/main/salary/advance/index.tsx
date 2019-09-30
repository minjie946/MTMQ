/**
 * @description 预支
 * @author maqian
 * @createTime 2019/07/11
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { BaseProps } from 'typings/global'
import { RootComponent, TableItem } from '@components/index'
import SearchItem from './components/SearchItem'
import { Errors, Info, Success } from '@components/icon/BasicIcon'
import { FormComponentProps } from 'antd/lib/form'
import { Form, Tabs, Icon, Select, DatePicker, Row, Col, Button } from 'antd'

// 组件引入
import AllPage from './advanceall' // 全部
import NoRepayPage from './advancenorepay'
import UnPayPage from './advanceunpay'
import PayPage from './advancepay'

import './style/index.styl'

const { TabPane } = Tabs

interface AdvancePageProps extends BaseProps {
}

interface AdvancePageState {
  // 默认的选中选项卡
  defaultActiveKey: string
  activeKey: string
}

export default class AdvancePage extends RootComponent<AdvancePageProps, AdvancePageState> {
  private serachParamData:any = {}
  constructor (props:AdvancePageProps) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    let defaultActiveKey = params.get('type') || 'all'
    this.state = {
      defaultActiveKey,
      activeKey: defaultActiveKey
    }
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  onChange = (activeKey:any) => {
    this.setState({ activeKey })
    this.props.history.push(`/home/salary/advance?type=${activeKey}`)
  }
  render () {
    let { defaultActiveKey, activeKey } = this.state
    const { location } = this.props
    let params = new URLSearchParams(location.search)
    activeKey = params.get('type') || 'all'
    return (
      <div className='advance-page'>
        <Tabs type="card" onChange={this.onChange} activeKey={activeKey} defaultActiveKey={defaultActiveKey}>
          <TabPane tab="全部" key="all">
            <AllPage {...this.props}></AllPage>
          </TabPane>
          <TabPane tab="未还款" key="norepay">
            <NoRepayPage {...this.props}></NoRepayPage>
          </TabPane>
          <TabPane tab="未发款" key="unpay">
            <UnPayPage {...this.props}></UnPayPage>
          </TabPane>
          <TabPane tab="已还款" key="pay">
            <PayPage {...this.props}></PayPage>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
