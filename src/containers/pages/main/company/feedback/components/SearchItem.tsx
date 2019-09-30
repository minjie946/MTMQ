/**
 * @description 意见反馈搜索
 * @author minjie
 * @createTime 2019/06/21
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Fill } from '@components/icon/BasicIcon'
import { Form, Input, Select, DatePicker, Row, Col } from 'antd'
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
  /** 时间进行改变 */
  changeDate = (date:any) => {
    let [startTime, endTime] = date
    const { getFieldDecorator } = this.props.form
    if (startTime && endTime) {
      getFieldDecorator('feedbackStartTime', { initialValue: startTime.valueOf() })
      getFieldDecorator('feedbackEndTime', { initialValue: endTime.valueOf() })
    }
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const layouObj = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { phoneNumber, feedbackType, feedbackStartTime, feedbackEndTime } = this.props.serachParam
    let Time = feedbackStartTime ? [moment(feedbackStartTime), moment(feedbackEndTime)] : undefined
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="手机号" className='cus-from-item'>
              {getFieldDecorator('phoneNumber', {
                initialValue: phoneNumber,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入手机号'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="反馈类型" className='cus-from-item'>
              {getFieldDecorator('feedbackType', {
                initialValue: feedbackType
              })(
                <Select allowClear placeholder='请选择反馈类型' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value='界面错误'>界面错误</Select.Option>
                  <Select.Option value='数据错误'>数据错误</Select.Option>
                  <Select.Option value='改进建议'>改进建议</Select.Option>
                  <Select.Option value='其他'>其他</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="创建时间" className='cus-from-item'>
              {getFieldDecorator('Time', {
                initialValue: Time
              })(
                <DatePicker.RangePicker suffixIcon={<Fill/>} placeholder={['请选择开始日期', '请选择结束日期']}
                  allowClear />
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
          allValues['feedbackStartTime'] = new Date(startTime.format('YYYY-MM-DD')).getTime()
          allValues['feedbackEndTime'] = new Date(endTime.format('YYYY-MM-DD')).getTime()
        }
        delete allValues.Time
      }
      getSerachParam(allValues)
    }
  }
})(SearchItem)
