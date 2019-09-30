/**
 * @description 岗位管理的搜索
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Select, DatePicker, Row, Col, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SharedOrganization } from '@shared/index'
import { ValidateUtil, formItemCol } from '@utils/index'
import moment from 'moment'

interface SearchItemProps extends FormComponentProps {
  // 获取搜索的条件
  getSerachParam:Function
  serachParam: any
}

interface SearchItemState {
  // 是否开启
  visible: boolean
}

class SearchItem extends RootComponent<SearchItemProps, SearchItemState> {
  constructor (props:SearchItemProps) {
    super(props)
    this.state = {
      visible: false
    }
  }

  /** 显示信息 */
  getCheckData = (data:any) => {
    let { setFieldsValue } = this.props.form
    setFieldsValue({ organize: data[0] })
  }

  /** 开启选择 */
  goCheck = (visible: boolean) => {
    this.setState({ visible })
  }

  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const layouObj = {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 }
    }
    const { visible } = this.state
    let organize = getFieldValue('organize')
    const { postName, systemStatus, startTime, endTime } = this.props.serachParam
    let Time = startTime ? [moment(startTime), moment(endTime)] : undefined
    return (
      <Form layout="inline" {...layouObj}>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="岗位名称" className='cus-from-item'>
              {getFieldDecorator('postName', {
                initialValue: postName,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入岗位名称'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="系统状态" className='cus-from-item'>
              {getFieldDecorator('systemStatus', {
                initialValue: systemStatus
              })(
                <Select allowClear placeholder='请选择系统状态' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value='已通过'>已通过</Select.Option>
                  <Select.Option value='未审核'>未审核</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="创建时间" className='cus-from-item'>
              {getFieldDecorator('Time', {
                initialValue: Time
              })(
                <DatePicker.RangePicker allowClear placeholder={['请选择开始日期', '请选择结束日期']}/>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="隶属架构" className='cus-from-item'>
              {getFieldDecorator('organize', {
                initialValue: organize
              })(
                <Input allowClear placeholder='请选择隶属架构'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item wrapperCol={{ span: 18, offset: 2 }}>
              <Button type='primary' onClick={this.goCheck.bind(this, true)}>选择</Button>
            </Form.Item>
          </Col>
        </Row>
        <SharedOrganization visible={visible} value={organize ? [organize] : []} disableMulti
          onChange={this.getCheckData}
          onCancel={this.goCheck}
        />
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
