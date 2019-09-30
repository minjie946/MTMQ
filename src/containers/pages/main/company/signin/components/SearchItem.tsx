/**
 * @description 签到管理-搜索组件
 * @author minjie
 * @createTime 2019/08/26
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ValidateUtil, formItemCol } from '@utils/index'

interface SearchItemProps extends FormComponentProps {
  // 获取搜索的条件
  getSerachParam:Function
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
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
    return (
      <Form {...layouObj} layout="inline">
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="用户姓名" className='cus-from-item'>
              {getFieldDecorator('userName', {
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入用户姓名'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="手机号" labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} className='cus-from-item'>
              {getFieldDecorator('phoneNumber', {
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入手机号'></Input>
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
    const { getSerachParam } = props
    if (getSerachParam) {
      getSerachParam(allValues)
    }
  }
})(SearchItem)
