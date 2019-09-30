/**
 * @description 人员信息查看(保存待用的)
 * @author minjie
 * @createTime 2019/05/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Button, Form, Input, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { JudgeUtil } from '@utils/index'

const TextArea = Input.TextArea

interface OnlyFormProps extends FormComponentProps {
}

class OnlyForm extends RootComponent<OnlyFormProps, any> {
  /** 提交信息 */
  handelSubmit = (e:any) => {
    e.preventDefault() // 取消默认的事件
    const { resetFields } = this.props.form
    let obj = { // 电子合同模板逐个绑定法大大
      type: 'get',
      path: 'steven/ect/{projectName}/bindFddOne/{version}'
    }
    // 类型进行检查
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.axios.request(obj, values).then((res:any) => {
          let { code, data, msg } = res
          if (code === 200 && JudgeUtil.isEmpty(data)) {
            this.$message.success('绑定成功')
            resetFields()
          } else {
            this.$message.error('绑定失败')
          }
        }).catch((err:any) => {
          let { msg } = err
          this.error(msg || err)
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    return (
      <Form layout="inline" onSubmit={this.handelSubmit}>
        <Form.Item label="合同的编号">
          {getFieldDecorator('ecNumber', {
            rules: [
              { required: true, message: '请输入' }
            ]
          })(
            <Input placeholder="合同的编号"></Input>
          )}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">合同的单个关联</Button>
        </Form.Item>
      </Form>
    )
  }
}

export const OnlyFormItem = Form.create<OnlyFormProps>()(OnlyForm)

interface InsertAuthCompanyAutoProps {
}

interface InsertAuthCompanyAutoState {
  msgData: string
}

// 新-企业实名存证全部，仅调用一次
export class InsertAuthCompanyAuto extends RootComponent<InsertAuthCompanyAutoProps, any> {
  constructor (props:InsertAuthCompanyAutoProps) {
    super(props)
    this.state = {
      msgData: ''
    }
  }

  // 新-企业实名存证全部，仅调用一次
  insertAuthCompanyAuto = () => {
    let obj = { // 电子合同模板逐个绑定法大大
      type: 'get',
      path: 'steven/fdd/{projectName}/insertAuthCompanyAuto/{version}'
    }
    this.axios.request(obj).then((res:any) => {
      let { code, data, msg } = res
      this.setState({ msgData: msg || JSON.stringify(res) })
    }).catch((err:any) => {
      let { msg } = err
      this.setState({ msgData: msg || err })
    })
  }

  render () {
    const { msgData } = this.state
    return (
      <div>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <Button type="primary" onClick={this.insertAuthCompanyAuto}>企业实名存证全部</Button>
          </Col>
        </Row>
        <Row justify='center'style={{ marginTop: 10 }}>
          <Col span={8} offset={8}>
            <TextArea value={msgData} rows={4}/>
          </Col>
        </Row>
      </div>
    )
  }
}
