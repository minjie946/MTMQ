/**
 * @description 电子合同 详情
 * @author minjie
 * @createTime 2019/05/14
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Button, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from 'typings/global'

import { ContractModel } from './components/query'

interface ContractDetailProps extends FormComponentProps, BaseProps {
  history: any
}

interface ContractDetailState {
  userId: any
  ContractInfo: ContractModel
}

class ContractDetail extends RootComponent<ContractDetailProps, ContractDetailState> {
  constructor (props:ContractDetailProps) {
    super(props)
    const { match } = this.props
    let userId = match.params.id || 0
    this.state = {
      userId: userId,
      ContractInfo: new ContractModel()
    }
  }

  /** 初始加载数据 */
  componentDidMount () {
    const { userId } = this.state
    if (userId !== 0) { // 查询详情
      this.getDetail(userId)
    }
  }

  /** 获取用户的信息 */
  getDetail = (userId:any) => {
    this.axios.request(this.api.contractDetail, {
      ecId: userId
    }).then(({ data }:any) => {
      this.setState({ ContractInfo: data })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 返回上一个界面 */
  goBack = () => {
    this.props.history.replace('/home/people/contract')
  }

  render () {
    const formItemLayout = {
      labelCol: { xs: { span: 24 }, sm: { span: 4 } },
      wrapperCol: { xs: { span: 24 }, sm: { span: 20 } }
    }
    const { ContractInfo: { downloadUrl, ecName, ecType, status, createTime, corporateName } } = this.state
    return (
      <Form {...formItemLayout} style={{ margin: 19 }}>
        <Row>
          <Col span={8}><Form.Item label="合同名称">{ecName}</Form.Item></Col>
          <Col span={2} offset={14}><Button onClick={this.goBack}>返回</Button></Col>
        </Row>
        <Row>
          <Col span={8}><Form.Item label="合同类型">{ecType}</Form.Item></Col>
          <Col span={8}><Form.Item label="状态">{status}</Form.Item></Col>
        </Row>
        <Row>
          <Col span={8}><Form.Item label="创建时间">{createTime}</Form.Item></Col>
        </Row>
        <Row>
          <Col span={8}><Form.Item label="甲方">{corporateName}</Form.Item></Col>
        </Row>
        <Row>
          <Col><iframe src={downloadUrl} frameBorder="0" style={{ width: '100%', height: 702 }}/></Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create<ContractDetailProps>()(ContractDetail)
