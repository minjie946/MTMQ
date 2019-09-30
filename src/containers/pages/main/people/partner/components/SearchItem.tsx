/**
 * @description 合伙人查询
 * @author minjie
 * @createTime 2019/07/5
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Select, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ValidateUtil, formItemCol } from '@utils/index'

interface SearchItemProps extends FormComponentProps {
  serachParam: any
  serachData: Function
}

interface SearchItemState {
}

class SearchItem extends RootComponent<SearchItemProps, SearchItemState> {
  constructor (props:SearchItemProps) {
    super(props)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const layouObj = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 }
    }
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="用户姓名" className='cus-from-item'>
              {getFieldDecorator('userName', {
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear type="text" placeholder="请输入用户姓名"></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="用户手机" className='cus-from-item'>
              {getFieldDecorator('phoneNumber', {
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear type="text" placeholder="请输入用户手机"></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="合伙人类别" className="cus-from-item" >
              {getFieldDecorator('partnerType')(
                <Select allowClear placeholder="请选择" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value='合伙人'>合伙人</Select.Option>
                  <Select.Option value='合伙人BD'>合伙人BD</Select.Option>
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
    const { serachData } = props
    if (serachData) {
      serachData(allValues)
    }
  }
})(SearchItem)
