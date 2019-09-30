/**
 * @description 人员信息查看(保存待用的)
 * @author minjie
 * @createTime 2019/05/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Tabs } from 'antd'

import OldPage from './old/index'
import NewPage from './new/index'
import QuitPage from './quit/index'

const { TabPane } = Tabs

interface PeopleQueryProps {
  history: any
  location?:any
}
interface PeopleQueryState {
  // 默认的选中选项卡
  defaultActiveKey: string
  activeKey: string
}

export default class PeopleQuery extends RootComponent<PeopleQueryProps, PeopleQueryState> {
  constructor (props:any) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    let defaultActiveKey = params.get('type') || 'old'
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
    this.props.history.push(`/home/people/query?type=${activeKey}`)
  }

  render () {
    let { defaultActiveKey, activeKey } = this.state
    const { location } = this.props
    let params = new URLSearchParams(location.search)
    activeKey = params.get('type') || 'new'
    return (
      <div className="card-container">
        <Tabs type="card" onChange={this.onChange} activeKey={activeKey} defaultActiveKey={defaultActiveKey}>
          <TabPane tab="待入职" key="new">
            <NewPage {...this.props}></NewPage>
          </TabPane>
          <TabPane tab="已入职" key="old">
            <OldPage {...this.props}></OldPage>
          </TabPane>
          <TabPane tab="已离职" key="quit">
            <QuitPage {...this.props}></QuitPage>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
