/**
 * @description 工资单
 * @author minjie
 * @createTime 2019/08/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, DatePicker, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import moment from 'moment'
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
    this.state = {
      visible: false
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const layouObj = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 }
    }
    const { payrollUserName, payrollYears } = this.props.serachParam
    let month = payrollYears ? moment(payrollYears) : undefined
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="姓名" className='cus-from-item'>
              {getFieldDecorator('payrollUserName', {
                initialValue: payrollUserName,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入用户名'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="年月" className='cus-from-item'>
              {getFieldDecorator('month', {
                initialValue: month
              })(
                <DatePicker.MonthPicker className='cus-from-item' format="YYYYMM" allowClear placeholder='请选择月份'/>
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
      if (allValues.month) {
        allValues['payrollYears'] = allValues.month.format('YYYYMM')
      }
      getSerachParam(allValues)
    }
  }
})(SearchItem)
