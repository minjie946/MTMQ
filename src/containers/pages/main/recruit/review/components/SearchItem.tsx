/**
 * @description 简历审核-搜索
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Input, Select, Row, Col, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { ValidateUtil, formItemCol } from '@utils/index'
import { SharedOrganization } from '@shared/index'

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
    const { postName, phoneNumber, sex, age, area, highestDegree, userName } = this.props.serachParam
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
            <Form.Item label="性别" className='cus-from-item'>
              {getFieldDecorator('sex', {
                initialValue: sex
              })(
                <Select allowClear placeholder='请选择性别' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value='男'>男</Select.Option>
                  <Select.Option value='女'>女</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="年龄" className='cus-from-item'>
              {getFieldDecorator('age', {
                initialValue: age,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入年龄'></Input>
              )}
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col {...formItemCol}>
            <Form.Item label="地区" className='cus-from-item'>
              {getFieldDecorator('area', {
                initialValue: area,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入地区'></Input>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="学历" className='cus-from-item'>
              {getFieldDecorator('highestDegree', {
                initialValue: highestDegree
              })(
                <Select allowClear placeholder='请选择学历' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                  <Select.Option value='初中及以下'>初中及以下</Select.Option>
                  <Select.Option value='高中'>高中</Select.Option>
                  <Select.Option value='大专'>大专</Select.Option>
                  <Select.Option value='本科'>本科</Select.Option>
                  <Select.Option value='硕士'>硕士</Select.Option>
                  <Select.Option value='博士'>博士</Select.Option>
                </Select>
              )}
            </Form.Item>
          </Col>
          <Col {...formItemCol}>
            <Form.Item label="姓名" className='cus-from-item'>
              {getFieldDecorator('userName', {
                initialValue: userName,
                getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
              })(
                <Input allowClear placeholder='请输入姓名'></Input>
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
        <SharedOrganization value={organize ? [organize] : []} disableMulti
          visible={visible} onCancel={this.goCheck} onChange={this.getCheckData}/>
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
