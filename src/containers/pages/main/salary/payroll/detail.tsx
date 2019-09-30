/**
 * @description 工资单详情
 * @author minjie
 * @createTime 2019/08/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Row, Col, Form, Divider, Modal, Tabs } from 'antd'

import { payDetail } from './components/payInfo'

import './style/detail.styl'

interface PayrollDetailProps {
  visible?: boolean
  onCancel?: Function
  detailId: number
}

interface PayrollDetailState {
  payrollInfo:any
  // modal的显示和隐藏
  visible: boolean
  payrollData: any
}

export default class PayrollDetail extends RootComponent<PayrollDetailProps, PayrollDetailState> {
  constructor (props:PayrollDetailProps) {
    super(props)
    this.state = {
      payrollInfo: {},
      visible: false,
      payrollData: {}
    }
  }

  componentDidUpdate (prevProps:any) {
    const { visible, detailId } = this.props
    if (prevProps.visible !== visible && visible) {
      this.hanldeModal(visible || false)
    }
    if (detailId !== prevProps.detailId && detailId !== -1) {
      this.getDetail(detailId)
    }
  }

  /** 是否显示这个弹窗 */
  hanldeModal = (visible:boolean) => {
    const { onCancel } = this.props
    if (!visible && onCancel) {
      this.setState(() => {})
      onCancel(visible)
    }
    this.setState({ visible })
  }

  /** 获取详情 */
  getDetail = (payrollId: number) => {
    this.axios.request(this.api.payrollDetail, {
      payrollId
    }).then((res:any) => {
      this.setState({ payrollInfo: res.data, payrollData: payDetail(res.data) })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  render () {
    const { payrollInfo, visible, payrollData } = this.state
    const { payrollUserName, payrollIdCard, payrollYears, payrollRealHairMoney, payrollAmountPayable, payrollRemark } = payrollInfo
    const formLayout = { labelCol: { span: 5 }, wrapperCol: { span: 17 } }
    // 支出 收入 为空
    const { payData, incomeData, zeroData } = payrollData
    return (
      <Modal title="工资单详情" visible={visible} footer={null} width={900} onCancel={this.hanldeModal.bind(this, false)}>
        <div>
          <Form {...formLayout}>
            <Divider orientation="left">基本信息</Divider>
            <Row>
              <Col span={12}>
                <Form.Item label='用户姓名'><span>{payrollUserName}</span></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='身份证'><span>{payrollIdCard}</span></Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='年月'><span>{payrollYears}</span></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='实发工资'><span>{payrollRealHairMoney}</span></Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label='应发金额'><span>{payrollAmountPayable}</span></Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='备注'><span>{payrollRemark}</span></Form.Item>
              </Col>
            </Row>
            {/* <Divider orientation="left">收入支出</Divider> */}
            <Tabs>
              {incomeData && <Tabs.TabPane tab="收入" key="in">
                <div className='payroll-content'>
                  {incomeData.map((el:any, key:number) => (
                    <div key={key} className='span-row'>
                      <span>{el.name}</span>:<span className='span-text'>{el.value}</span>
                    </div>
                  ))}
                </div>
              </Tabs.TabPane>}
              {payData && <Tabs.TabPane tab="支出" key="on">
                <div className='payroll-content'>
                  {payData.map((el:any, key:number) => (
                    <div key={key} className='span-row'>
                      <span>{el.name}</span>:<span className='span-text-two'>{el.value}</span>
                    </div>
                  ))}
                </div>
              </Tabs.TabPane>}
            </Tabs>
          </Form>
        </div>
      </Modal>
    )
  }
}
