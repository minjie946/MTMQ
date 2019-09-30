/**
 * @description 岗位管理-审核
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Form, Row, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import moment from 'moment'

import { PostInfoVer } from '../components/PostInfo'

import { JudgeUtil } from '@utils/index'

const arySort = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']
interface PostDetailProps extends FormComponentProps {
  // 岗位的ID
  pmId: number
  visible: boolean
  onCancel?: Function
}

interface PostDetailState {
  // 数据信息
  postInfo:PostInfoVer
  // 提交按钮的禁用
  disableBtn:boolean
  // 错误消息的显示
  errorMsg: string
  type:string
  deadlineAry: Array<string>
  visibleModal: boolean
}

class PostDetail extends RootComponent<PostDetailProps, PostDetailState> {
  constructor (props:PostDetailProps) {
    super(props)
    this.state = {
      postInfo: new PostInfoVer(),
      disableBtn: false,
      type: 'query',
      errorMsg: '',
      deadlineAry: [],
      visibleModal: false
    }
  }

  componentDidUpdate (prevProps:any) {
    let { pmId } = this.props
    if (pmId !== prevProps.pmId && pmId !== -1) {
      this.getDetail(pmId)
    }
  }

  /** 获取数据的信息 */
  getDetail = (pmId:number) => {
    this.axios.request(this.api.postDetailVerify, { pmId }).then((res:any) => {
      const { data } = res
      let deadlineAry:Array<string> = []
      arySort.forEach((key:any) => {
        let t = data[`deadline${key}`]
        let d = data[`brokerage${key}`]
        if (!JudgeUtil.isEmpty(t) && !JudgeUtil.isEmpty(d) && t !== 0 && d !== 0) {
          deadlineAry.push(`${t}天/￥${d}`)
        }
      })
      this.setState({ postInfo: data, deadlineAry })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 清空数据 */
  resetFields = () => {
    this.setState({ postInfo: new PostInfoVer() })
    this.props.form.resetFields()
  }

  /** 错误消息的弹出框关闭 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 审核的信息 */
  verifyChange = (reviewOpinion:number) => {
    // 0同意/1拒绝
    let { pmId } = this.props
    let obj:any = {
      pmId: Number(pmId),
      reviewOpinion
    }
    this.setState({ disableBtn: true })
    this.axios.request(this.api.postReview, obj).then((res:any) => {
      this.setState({ disableBtn: false })
      this.$message.success('审核成功！')
      this.handleModel() // 关闭，之后记得刷新
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err })
      this.setState({ disableBtn: false })
      this.handleBasicModal(1)
    })
  }

  /** 当前窗口的 开关 */
  handleModel = () => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.resetFields()
    if (onCancel) onCancel(false)
  }

  render () {
    const { postInfo, errorMsg, disableBtn, deadlineAry, visibleModal } = this.state
    const latoutObj = {
      labelCol: { span: 4, offset: 4 },
      wrapperCol: { span: 12 }
    }
    const { organize, phoneNumber, postName, createTime, createUser, brokerage } = postInfo
    const { visible } = this.props
    const propsModal = {
      title: '审核',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel,
      footer: false,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <Form {...latoutObj}>
          <Form.Item label='岗位名称'>{postName || '---'}</Form.Item>
          <Form.Item label='隶属架构'>{organize || '---'}</Form.Item>
          <Form.Item label='创建时间'>{!JudgeUtil.isEmpty(createTime) ? moment(createTime).format('YYYY-MM-DD HH:mm') : '---'}</Form.Item>
          <Form.Item label='创建人'>{createUser || '---'}</Form.Item>
          <Form.Item label='手机号'>{phoneNumber || '---'}</Form.Item>
          <Form.Item label='佣金金额'>{brokerage || '---'}</Form.Item>
          <Form.Item label='提佣期限'>{deadlineAry.length > 0 ? deadlineAry.join(',') : '---'}</Form.Item>
          <Form.Item className='btn-inline-group' wrapperCol={{ span: 16, offset: 8 }}>
            <Button type='primary' disabled={disableBtn} onClick={this.verifyChange.bind(this, 0)}>审核通过</Button>
            <Button type='primary' disabled={disableBtn} onClick={this.verifyChange.bind(this, 1)} ghost>不通过</Button>
            <Button onClick={this.handleModel}>取消</Button>
          </Form.Item>
          <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
            <div className="model-error">
              <p>{errorMsg}</p>
            </div>
            <Row className='cus-modal-btn-top'>
              <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
            </Row>
          </BasicModal>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<PostDetailProps>()(PostDetail)
