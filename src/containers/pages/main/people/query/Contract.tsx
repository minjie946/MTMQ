/**
 * @description 人员信息电子合同
 * @author minjie
 * @createTime 2019/05/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Modal, Icon, Form, Select, Button } from 'antd'
import { BaseProps } from 'typings/global'
import { SysUtil } from '@utils/index'

import './style/contract.styl'

interface ContractProps extends BaseProps {
  history: any
}

interface ContractState {
  userId: number
  iframeSrc: string
  dowloadURl: string
  // Modal 的显示
  visible: boolean
}

export default class Contract extends RootComponent<ContractProps, ContractState> {
  constructor (props:ContractProps) {
    super(props)
    const { match } = this.props
    let userId = match.params.id || 0
    this.state = {
      userId,
      iframeSrc: '',
      dowloadURl: '',
      visible: false
    }
  }
  goBack = () => {
    this.props.history.replace('/home/people/query')
  }

  componentDidMount () {
    const { userId } = this.state
    let obj = SysUtil.getSessionStorage('contract-url')
    if (obj.electronicContract) {
      this.setState({ iframeSrc: obj.electronicContract })
    } else {
      this.axios.request(this.api.queryContractUrl, { userId }).then((res:any) => {
        const { data } = res
        this.setState({ iframeSrc: data })
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }

  /** num: 0: 关 1: 开 */
  handelModal = (num:number) => {
    this.setState({ visible: num === 1 })
  }

  /** 下载文件 */
  dowloadFile = () => {
    let obj = SysUtil.getSessionStorage('contract-url')
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = obj.downloadContract
    document.body.appendChild(link)
    link.click()
  }

  componentWillUnmount () {
    SysUtil.clearSession('contract-url')
  }

  render () {
    const { iframeSrc, visible } = this.state
    let height = document.body.clientHeight
    let minHeight = height - 140
    if (minHeight < 600) {
      minHeight = 600
    }
    return (
      <div className="contract-content" style={{ height: `${minHeight}px` }}>
        <iframe src={iframeSrc} frameBorder="0"></iframe>
        <div className="contract-dowload">
          <p onClick={this.handelModal.bind(this, 1)}><Icon type="upload"></Icon>导出</p>
        </div>
        <Modal onCancel={this.handelModal.bind(this, 0)}
          footer={null} visible={visible} title="导出">
          <Form >
            <Form.Item label="导出类型" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
              <Select className="cus-input-220" value="PDF" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                <Select.Option value="PDF">PDF文件</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item className="btn-inline-group" wrapperCol={{ span: 16, offset: 8 }}>
              <Button type="primary" onClick={this.dowloadFile}>确认</Button>
              <Button onClick={this.handelModal.bind(this, 0)}>取消</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}
