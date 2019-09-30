/**
 * @description 人员的查询
 * @author minjie
 * @createTime 2019/05/14
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Select, Row, Col, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ValidateUtil, formItemCol } from '@utils/index'
import moment from 'moment'

const layouObj = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

interface SearchItemProps extends FormComponentProps {
  serachParam: any
  setSerachParam: Function
  // 搜索是新的还是旧的
  type: 'old' | 'new' | 'quit'
}

interface SearchItemState {
  // 合同主体
  CorporateNameAry: Array<any>
}

class SearchItem extends RootComponent<SearchItemProps, SearchItemState> {
  constructor (props:SearchItemProps) {
    super(props)
    this.state = {
      CorporateNameAry: []
    }
  }

  componentDidMount () {
    this.getContractCorporateName() // 查询合同主体
  }

  /** 查询公司的信息 */
  getContractCorporateName () {
    this.axios.request(this.api.companyGetCompanyName).then((res:any) => {
      this.setState({ CorporateNameAry: res.data || [] })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  render () {
    const { form: { getFieldDecorator }, type, serachParam } = this.props
    const { CorporateNameAry } = this.state
    const { userName, phoneNumber, contractSubject, nowState, organize, postName, startTime, endTime } = serachParam
    // 用户姓名 手机号 合同主体 入职状态 实名状态
    let Time = startTime ? [moment(startTime), moment(endTime)] : undefined
    return (
      <Form {...layouObj} layout="inline">
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="用户姓名" className='cus-from-item'>
              {getFieldDecorator('userName', {
                initialValue: userName || undefined,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear type="text" placeholder="请输入用户姓名"></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="用户手机" className='cus-from-item'>
              {getFieldDecorator('phoneNumber', {
                initialValue: phoneNumber || undefined,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear maxLength={11} type="text" placeholder="请输入用户手机"></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="合同主体" className="cus-select-autowidth cus-from-item" >
              {getFieldDecorator('contractSubject', {
                initialValue: contractSubject || undefined
              })(
                <Select allowClear placeholder="请选择" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  {CorporateNameAry.map((el:any, index:number) => (
                    <Select.Option key={index} value={el}>{el}</Select.Option>
                  ))}
                </Select>
              )}
            </Form.Item>
          </Col>
          {type === 'new' && <Col {...formItemCol}>
            <Form.Item label="当前状态" className="cus-select-autowidth cus-from-item" >
              {getFieldDecorator('nowState', {
                initialValue: nowState
              })(
                <Select allowClear placeholder="请选择" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value="待签署">待签署</Select.Option>
                  <Select.Option value="待完善">待完善</Select.Option>
                  <Select.Option value="待绑卡">待绑卡</Select.Option>
                  <Select.Option value="待审核">待审核</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>}
          {type === 'old' && <Col {...formItemCol}>
            <Form.Item label="岗位名称" className='cus-from-item'>
              {getFieldDecorator('postName', {
                initialValue: postName || undefined,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear type="text" placeholder="请输入岗位名称"></Input>
              )}
            </Form.Item>
          </Col>}
        </Row>
        {type === 'old' && <Row>
          <Col {...formItemCol}>
            <Form.Item label="创建时间" className='cus-from-item'>
              {getFieldDecorator('Time', {
                initialValue: Time
              })(
                <DatePicker.RangePicker placeholder={['请选择开始日期', '请选择结束日期']} allowClear />
              )}
            </Form.Item>
          </Col>
        </Row>}
        {type === 'new' && <Row>
          <Col {...formItemCol}>
            <Form.Item label="组织" className='cus-from-item'>
              {getFieldDecorator('userOrganize', {
                initialValue: organize || undefined,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear type="text" placeholder="请输入组织"></Input>
              )}
            </Form.Item>
          </Col>
        </Row>}
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
