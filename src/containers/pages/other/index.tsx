/**
 * @description 人员信息查看(保存待用的)
 * @author minjie
 * @createTime 2019/05/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Divider, Tabs } from 'antd'
import { JudgeUtil } from '@utils/index'
import { BaseProps } from '@typings/global'

import { UserOneItem, UserTwoItem, UserThereItem } from './user/index'
import { OnlyFormItem, InsertAuthCompanyAuto } from './contract/index'
import { ModalItem } from './modal'

const { TabPane } = Tabs

export default class ContractOther extends RootComponent<BaseProps, any> {
  constructor (props:any) {
    super(props)
  }
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 一次性的 */
  contractAll = () => {
    let obj = { // 所有电子合同模板一次性绑定法大大
      type: 'get',
      path: 'steven/ect/{projectName}/bindFdd/{version}'
    }
    this.axios.request(obj).then((res:any) => {
      let { code, data, msg } = res
      if (code === 200 && JudgeUtil.isEmpty(data)) {
        this.$message.success('绑定成功')
      } else {
        this.$message.error('绑定失败')
      }
    }).catch((err:any) => {
      let { msg } = err
      this.error(msg || err)
    })
  }

  /** 首页的信息 */
  goBack = () => {
    this.props.history.replace('/home/homeInfo')
  }

  render () {
    return (
      <div>
        <Button type='primary' onClick={this.goBack}>返回主页</Button>
        <div style={{ width: '100%', height: '100%', textAlign: 'center' }}>
          <Tabs defaultActiveKey="1">
            <TabPane tab="（赵伟江）" key="1">
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <Button type="primary" onClick={this.contractAll}>合同的全部关联</Button>
              </span>
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <OnlyFormItem/>
              </span>
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <InsertAuthCompanyAuto/>
              </span>
            </TabPane>
            <TabPane tab="（周字健）" key="2">
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                {/** 1.7线下面试数据兼容-搞完就删 */}
                <ModalItem URL={{ type: 'get', path: 'natasha2/Resume/updateV7' }} btnTitle='1.7线下面试数据兼容' />
              </span>
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <UserOneItem/>
              </span>
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <UserThereItem />
              </span>
              <span style={{ margin: '2% 0 0', display: 'block' }}>
                <UserTwoItem />
              </span>
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}
