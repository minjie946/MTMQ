/**
 * @description banner
 * @author minjie
 * @createTime 2019/08/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { BaseProps } from '@typings/global'
import { Tabs } from 'antd'
import { RootComponent } from '@components/index'
import PayPage from './pay' // 薪酬版
import RecruitPage from './recruit' // 招聘版
import PartnerPage from './partner' // 合伙人版

const { TabPane } = Tabs

interface BannerInformationProps extends BaseProps {
  mobxCommon?:any
}

interface BannerInformationState {
  // 默认的选中选项卡
  defaultActiveKey: string
  activeKey: string
}

export default class BannerInformation extends RootComponent<BannerInformationProps, BannerInformationState> {
  constructor (props:BannerInformationProps) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    let defaultActiveKey = params.get('type') || 'pay'
    this.state = {
      defaultActiveKey,
      activeKey: defaultActiveKey
    }
  }

  onChange = (activeKey:any) => {
    this.setState({ activeKey })
    this.props.history.push(`/home/company/banner?type=${activeKey}`)
  }

  render () {
    let { defaultActiveKey, activeKey } = this.state
    return (
      <div className='card-container'>
        <Tabs type="card" onChange={this.onChange} activeKey={activeKey} defaultActiveKey={defaultActiveKey}>
          <TabPane tab="薪酬版" key="pay">
            <PayPage {...this.props} />
          </TabPane>
          <TabPane tab="招聘版" key="recruit">
            <RecruitPage {...this.props} />
          </TabPane>
          <TabPane tab="合伙人版" key="partner">
            <PartnerPage {...this.props} />
          </TabPane>
        </Tabs>
      </div>
    )
  }
}
