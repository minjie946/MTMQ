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
interface ModalProps {
  URL: {
    type: string,
    path: string
  },
  param: any
  btnTitle?: string
}
interface ModalState {
  msgData: string
}

class Modal extends RootComponent<ModalProps, ModalState> {
  constructor (props:any) {
    super(props)
    this.state = {
      msgData: ''
    }
  }

  static defaultProps = {
    param: {},
    btnTitle: '按钮'
  }

  /** 提交信息 */
  handelSubmit = () => {
    const { URL, param } = this.props
    // 类型进行检查
    this.axios.request(URL, param).then((res:any) => {
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
              <Button type="primary" onClick={this.handelSubmit}>{this.props.btnTitle}</Button>
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

export const ModalItem = Form.create<any>()(Modal)
