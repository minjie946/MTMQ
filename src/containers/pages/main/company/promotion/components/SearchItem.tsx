/**
 * @description 晋升通过表单
 * @author maqian
 * @createTime 2019/07/11
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
  serachParam: any
}

interface SearchItemState {
}

class SearchItem extends RootComponent<SearchItemProps, SearchItemState> {
  constructor (props:SearchItemProps) {
    super(props)
  }

  /** 显示信息 */
  getCheckData = (data:any) => {
    let { setFieldsValue } = this.props.form
    setFieldsValue({ organize: data[0] })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const layouObj = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { postName } = this.props.serachParam
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="岗位名称" className='cus-from-item'>
              {getFieldDecorator('postName', {
                initialValue: postName,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入'></Input>
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
