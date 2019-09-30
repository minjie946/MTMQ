/**
 * @description 公司信息-搜索组件
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ValidateUtil } from '@utils/index'

const layouObj = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const colObj = { sm: 9, lg: 9, xl: 8, xxl: 6 }

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
    return (
      <Form {...layouObj} layout="inline">
        <Row>
          <Col {...colObj}>
            <Form.Item label="项目名称" className='cus-from-item'>
              {getFieldDecorator('projectName', {
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入项目名称'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...colObj}>
            <Form.Item label="联系人" className='cus-from-item'>
              {getFieldDecorator('connectionUser', {
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入联系人'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...colObj}>
            <Form.Item label="联系人电话" className='cus-from-item'>
              {getFieldDecorator('phoneNumber', {
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入联系人电话'></Input>
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
