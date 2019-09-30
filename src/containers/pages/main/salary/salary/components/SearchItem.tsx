/**
 * @description 工资
 * @author minjie
 * @createTime 2019/08/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Row, Col, Select } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ValidateUtil, formItemCol } from '@utils/index'

interface SearchItemProps extends FormComponentProps {
  // 获取搜索的条件
  getSerachParam:Function
  onStateChange: Function
  serachParam:any
}

interface SearchItemState {
  CorporateNameAry: Array<any>
}

class SearchItem extends RootComponent<SearchItemProps, SearchItemState> {
  constructor (props:SearchItemProps) {
    super(props)
    this.state = {
      CorporateNameAry: []
    }
  }

  componentDidMount () {
    // 查询合同主体
    this.getContractCorporateName()
  }

  /** 查询公司的信息 */
  getContractCorporateName () {
    this.axios.request(this.api.companyGetCompanyName).then((res:any) => {
      this.setState({ CorporateNameAry: res.data || [] })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  render () {
    const { CorporateNameAry } = this.state
    const { getFieldDecorator } = this.props.form
    const layouObj = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
    const { userName, sendMoneySubject, operationState } = this.props.serachParam
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="姓名" className='cus-from-item'>
              {getFieldDecorator('userName', {
                initialValue: userName,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入用户名'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="发薪主体" className="cus-select-autowidth cus-from-item" >
              {getFieldDecorator('sendMoneySubject', {
                initialValue: sendMoneySubject
              })(
                <Select allowClear placeholder='请选择发薪主体' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  {CorporateNameAry.map((el:any, index:number) => (
                    <Select.Option key={index} value={el}>{el}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="处理状态" className='cus-from-item'>
              {getFieldDecorator('operationState', {
                initialValue: operationState || 5300
              })(
                <Select placeholder='处理状态' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value={5300}>未划账</Select.Option>
                  <Select.Option value={7000}>已划账</Select.Option>
                  <Select.Option value={4000}>已撤销</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    )
  }
}

export default Form.create<SearchItemProps>({
  onValuesChange: (props, changedValues, allValues) => {
    const { getSerachParam, onStateChange } = props
    if (getSerachParam) {
      getSerachParam(allValues)
    }
    onStateChange(allValues.operationState)
  }
})(SearchItem)
