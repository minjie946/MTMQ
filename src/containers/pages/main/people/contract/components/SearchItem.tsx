/**
 * @description 电子合同的查询
 * @author minjie
 * @createTime 2019/05/14
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

class SearchItem extends RootComponent<SearchItemProps, any> {
  constructor (props:SearchItemProps) {
    super(props)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const layouObj = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { ecName, corporateName, status } = this.props.serachParam
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="合同名称" className='cus-from-item'>
              {getFieldDecorator('ecName', {
                initialValue: ecName,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear type="text" placeholder="请输入合同名称"></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="所属公司" className='cus-from-item'>
              {getFieldDecorator('corporateName', {
                initialValue: corporateName,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear type="text" placeholder="请输入所属公司"></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="使用状态" className='cus-from-item'>
              {getFieldDecorator('status', {
                initialValue: status || 'all'
              })(
                <Select placeholder="请选择" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value="all">全部</Select.Option>
                  <Select.Option value="下架">下架</Select.Option>
                  <Select.Option value="上架">上架</Select.Option>
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
      if (allValues.status && allValues.status === 'all') {
        allValues.status = undefined
      }
      serachData(allValues)
    }
  }
})(SearchItem)
