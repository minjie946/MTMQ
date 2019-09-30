/**
 * @description 公司信息-搜索组件
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Select, DatePicker, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import { industryCategoryAry } from './info'
import { ValidateUtil, formItemCol } from '@utils/index'
import moment from 'moment'

const layouObj = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

interface SearchItemProps extends FormComponentProps {
  // 获取搜索的条件
  setSerachParam:Function
  serachParam:any
}

interface SearchItemState {
}

class SearchItem extends RootComponent<SearchItemProps, SearchItemState> {
  constructor (props:SearchItemProps) {
    super(props)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { companyName, legalPerson, nature, industryCategory, startTime, endTime } = this.props.serachParam
    let Time = startTime ? [moment(startTime), moment(endTime)] : undefined
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="公司名称" className='cus-from-item'>
              {getFieldDecorator('companyName', {
                initialValue: companyName || undefined,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入公司名称'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="法人" className='cus-from-item'>
              {getFieldDecorator('legalPerson', {
                initialValue: legalPerson || undefined,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入法人姓名'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="公司性质" className='cus-from-item'>
              {getFieldDecorator('nature', {
                initialValue: nature || undefined
              })(
                <Select allowClear placeholder='请选择公司性质' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value='国有企业'>国有企业</Select.Option>
                  <Select.Option value='集体所有制'>集体所有制</Select.Option>
                  <Select.Option value='私营企业'>私营企业</Select.Option>
                  <Select.Option value='股份制企业'>股份制企业</Select.Option>
                  <Select.Option value='有限合伙企业'>有限合伙企业</Select.Option>
                  <Select.Option value='联营企业'>联营企业</Select.Option>
                  <Select.Option value='外商投资企业'>外商投资企业</Select.Option>
                  <Select.Option value='个人独资企业'>个人独资企业</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="行业类别" className='cus-from-item'>
              {getFieldDecorator('industryCategory', {
                initialValue: industryCategory || undefined
              })(
                <Select allowClear placeholder='请选择行业类别' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  {industryCategoryAry.map((el:string, key:number) => (
                    <Select.Option value={el} key={key}>{el}</Select.Option>
                  ))}
                </Select>
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
    const { setSerachParam } = props
    if (setSerachParam) {
      if (allValues.Time) {
        let [startTime, endTime] = allValues.Time
        if (startTime && endTime) {
          allValues['startTime'] = new Date(startTime.format('YYYY-MM-DD')).getTime()
          allValues['endTime'] = new Date(endTime.format('YYYY-MM-DD')).getTime()
        }
        delete allValues.Time
      }
      setSerachParam(allValues)
    }
  }
})(SearchItem)
