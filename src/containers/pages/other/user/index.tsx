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

const { TextArea } = Input

interface UserOneProps extends FormComponentProps {
}

interface UserOneState {
  msgData: any
}

// 补充信息
class UserOne extends RootComponent<UserOneProps, UserOneState> {
  constructor (props:UserOneProps) {
    super(props)
    this.state = {
      msgData: ''
    }
  }
  /** 提交信息 */
  handelSubmit = (e:any) => {
    e.preventDefault() // 取消默认的事件
    const { resetFields } = this.props.form
    let obj = { // 电子合同模板逐个绑定法大大
      type: 'get',
      path: 'howard/Fdd/getSignResult'
    }
    // 类型进行检查
    this.props.form.validateFields((err:any, values:any) => {
      if (!err) {
        this.axios.request(obj, values).then((res:any) => {
          let { code, data, msg } = res
          this.setState({ msgData: msg || JSON.stringify(res) })
        }).catch((err:any) => {
          let { msg } = err
          this.setState({ msgData: msg || err })
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { msgData } = this.state
    return (
      <Form layout="inline" onSubmit={this.handelSubmit}>
        <Row>
          <Col span={24}>
            <Form.Item label="用户编号">
              {getFieldDecorator('userId', {
                rules: [
                  { required: true, message: '请输入' }
                ]
              })(
                <Input allowClear placeholder="用户编号"></Input>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">查询用户 签署结果</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <TextArea value={msgData} rows={4}/>
          </Col>
        </Row>
      </Form>
    )
  }
}

export const UserOneItem = Form.create<UserOneProps>()(UserOne)

interface UserTwoProps extends FormComponentProps {
}

interface UserTwoState {
  msgData: any
}

// 补充用户签署信息
class UserTwo extends RootComponent<UserTwoProps, UserTwoState> {
  constructor (props:UserTwoProps) {
    super(props)
    this.state = {
      msgData: ''
    }
  }
  /** 提交信息 */
  handelSubmit = (e:any) => {
    e.preventDefault() // 取消默认的事件
    const { resetFields } = this.props.form
    let obj = { // 电子合同模板逐个绑定法大大
      type: 'get',
      path: 'howard/Fdd/supplement'
    }
    // 类型进行检查
    this.props.form.validateFields((err:any, values:any) => {
      if (!err) {
        this.axios.request(obj, values).then((res:any) => {
          let { code, data, msg } = res
          this.setState({ msgData: msg || JSON.stringify(res) })
        }).catch((err:any) => {
          let { msg } = err
          this.setState({ msgData: msg || err })
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { msgData } = this.state
    return (
      <Form layout="inline" onSubmit={this.handelSubmit}>
        <Row>
          <Col span={24}>
            <Form.Item label="用户编号">
              {getFieldDecorator('userId', {
                rules: [
                  { required: true, message: '请输入' }
                ]
              })(
                <Input allowClear placeholder="用户编号"></Input>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">补充用户签署信息</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <TextArea value={msgData} rows={4}/>
          </Col>
        </Row>
      </Form>
    )
  }
}

export const UserTwoItem = Form.create<UserTwoProps>()(UserTwo)

interface UserThereProps extends FormComponentProps {
}

interface UserThereState {
  msgData: any
}

// 查看合同
class UserThere extends RootComponent<UserThereProps, UserThereState> {
  constructor (props:UserThereProps) {
    super(props)
    this.state = {
      msgData: ''
    }
  }
  /** 提交信息 */
  handelSubmit = (e:any) => {
    e.preventDefault() // 取消默认的事件
    const { resetFields } = this.props.form
    let obj = { // 电子合同模板逐个绑定法大大
      type: 'get',
      path: 'howard/Fdd/getUserContractUrl'
    }
    // 类型进行检查
    this.props.form.validateFields((err:any, values:any) => {
      if (!err) {
        this.axios.request(obj, values).then((res:any) => {
          let { code, data, msg } = res
          this.setState({ msgData: data })
        }).catch((err:any) => {
          let { msg } = err
          this.setState({ msgData: msg || err })
        })
      }
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { msgData } = this.state
    return (
      <Form layout="inline" onSubmit={this.handelSubmit}>
        <Row>
          <Col span={24}>
            <Form.Item label="用户编号">
              {getFieldDecorator('userId', {
                rules: [
                  { required: true, message: '请输入' }
                ]
              })(
                <Input allowClear placeholder="用户编号"></Input>
              )}
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">查看合同</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <TextArea value={msgData} rows={4}/>
          </Col>
        </Row>
      </Form>
    )
  }
}

export const UserThereItem = Form.create<UserThereProps>()(UserThere)

interface UserFourProps extends FormComponentProps {
}

interface UserFourState {
  msgData: any
}

// 查看合同
class UserFour extends RootComponent<UserFourProps, UserFourState> {
  constructor (props:UserFourProps) {
    super(props)
    this.state = {
      msgData: ''
    }
  }
  /** 提交信息 */
  handelSubmit = () => {
    let obj = {
      type: 'get',
      path: 'howard/staff/helpUpdateEntryState'
    }
    // 类型进行检查
    this.axios.request(obj).then((res:any) => {
      let { msg } = res
      this.setState({ msgData: msg })
    }).catch((err:any) => {
      let { msg } = err
      this.setState({ msgData: msg || err })
    })
  }

  render () {
    const { msgData } = this.state
    return (
      <Form layout="inline">
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" onClick={this.handelSubmit}>同步电子签流水状态</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <TextArea value={msgData} rows={4}/>
          </Col>
        </Row>
      </Form>
    )
  }
}

export const UserFourItem = Form.create<UserFourProps>()(UserFour)

interface UserFiveState {
  msgData: string
}

class UserFive extends RootComponent<any, UserFiveState> {
  constructor (props:any) {
    super(props)
    this.state = {
      msgData: ''
    }
  }
  /** 提交信息 */
  handelSubmit = () => {
    let obj = {
      type: 'get',
      path: 'howard/staff/{projectName}/helpElectionSign/{version}'
    }
    // 类型进行检查
    this.axios.request(obj).then((res:any) => {
      let { msg } = res
      this.setState({ msgData: msg })
    }).catch((err:any) => {
      let { msg } = err
      this.setState({ msgData: msg || err })
    })
  }

  render () {
    const { msgData } = this.state
    return (
      <Form layout="inline">
        <Row>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" onClick={this.handelSubmit}>(只能点击一次)同步1.5版本之前的电子签数据</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row justify='center'>
          <Col span={8} offset={8}>
            <TextArea value={msgData} rows={4}/>
          </Col>
        </Row>
      </Form>
    )
  }
}

export const UserFiveItem = Form.create<any>()(UserFive)
