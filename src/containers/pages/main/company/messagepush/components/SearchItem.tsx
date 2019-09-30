/**
 * @description 消息推送
 * @author minjie
 * @createTime 2019/06/12
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
  }
  render () {
    const { getFieldDecorator } = this.props.form
    const layouObj = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { keyWord, author, startTime, endTime } = this.props.serachParam
    let Time = startTime ? [moment(startTime), moment(endTime)] : undefined
    return (
      <Form {...layouObj} layout="inline">
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="关键字" className='cus-from-item'>
              {getFieldDecorator('keyWord', {
                initialValue: keyWord,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入关键字'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="作者" className='cus-from-item'>
              {getFieldDecorator('author', {
                initialValue: author,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入作者'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="创建时间" className='cus-from-item'>
              {getFieldDecorator('Time', {
                initialValue: Time
              })(
                <DatePicker.RangePicker placeholder={['请选择开始日期', '请选择结束日期']} allowClear />
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
      if (allValues.Time) {
        let [startTime, endTime] = allValues.Time
        if (startTime && endTime) {
          allValues['startTime'] = new Date(startTime.format('YYYY-MM-DD')).getTime()
          allValues['endTime'] = new Date(endTime.format('YYYY-MM-DD')).getTime()
        }
        delete allValues.Time
      }
      getSerachParam(allValues)
    }
  }
})(SearchItem)
