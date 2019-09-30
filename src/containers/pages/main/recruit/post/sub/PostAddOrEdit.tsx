/**
 * @description 岗位管理-新增编辑
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Form, Input, Icon, Row, Col, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { inject, observer } from 'mobx-react'
import { PostInfo } from '../components/PostInfo'
import { JudgeUtil, ValidateUtil, SysUtil, globalEnum } from '@utils/index'
import { SharedOrganization } from '@shared/index'

import '../style/index.styl'

const arySort = ['One', 'Two', 'Three', 'Four', 'Five', 'Six']

const latoutObj = {
  labelCol: { span: 4, offset: 4 },
  wrapperCol: { span: 12 }
}

interface PostAddOrEditProps extends FormComponentProps {
  // 岗位的ID
  pmId: number
  type: 'edit' | 'add'
  mobxCommon?:any
  visible: boolean
  onCancel?: Function
}

interface PostAddOrEditState {
  // 数据信息
  postInfo:PostInfo
  // 提交按钮的禁用
  disableBtn:boolean
  // 错误消息的显示
  errorMsg: string
  arySortState: Array<string>
  // 重复添加的组织
  errorAry: Array<any>
  // 是否清除数据
  clearData: boolean
  visibleModal: boolean
  visibleModalMore: boolean
}
@inject('mobxCommon')
@observer
class PostAddOrEdit extends RootComponent<PostAddOrEditProps, PostAddOrEditState> {
  constructor (props:PostAddOrEditProps) {
    super(props)
    this.state = {
      postInfo: new PostInfo(),
      disableBtn: false,
      errorMsg: '',
      arySortState: ['One'],
      errorAry: [],
      clearData: false,
      visibleModal: false,
      visibleModalMore: false
    }
  }

  componentDidUpdate (prevProps:any) {
    let { pmId, type } = this.props
    if (type === 'edit' && pmId !== prevProps.pmId && pmId !== -1) {
      this.getDetail(pmId)
    }
  }

  /** 获取数据的信息 */
  getDetail = (pmId:number) => {
    this.axios.request(this.api.postDetail, { pmId }).then((res:any) => {
      const { data } = res
      let arySortState = arySort.filter((el:string) => {
        let val = data[`deadline${el}`]
        return !JudgeUtil.isEmpty(val) && val !== 0
      })
      this.setState({ postInfo: data, arySortState })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 清空数据 */
  resetFields = () => {
    const { type, form } = this.props
    this.setState({ postInfo: new PostInfo(), arySortState: ['One'] })
    if (type !== 'edit') {
      this.goClearOrgain(true)
    }
    form.resetFields()
  }

  /** 开启选择 */
  goClearOrgain = (clearData: boolean) => {
    this.setState({ clearData })
  }

  /** 错误消息的弹出框关闭 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 错误消息的弹出框关闭 */
  handleBasicModalMore = (num:number) => {
    this.setState({ visibleModalMore: num === 1 })
  }

  /** 提交信息 */
  submitHandel = (e:any) => {
    e.preventDefault()
    const { form, type } = this.props
    form.validateFields((err:any, values:any) => {
      if (!err) {
        this.sortParams(values)
        this.setState({ disableBtn: true })
        delete values.keys
        values['userId'] = SysUtil.getLocalStorage(globalEnum.userID)
        if (type === 'edit') {
          delete values.postName
          delete values.organize
          this.axios.request(this.api.postUpdate, values).then((res:any) => {
            this.setState({ disableBtn: false })
            this.$message.success('修改成功！')
            this.handleModel() // 关闭，之后记得刷新
          }).catch((err:any) => {
            const { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleBasicModal(1)
          })
        } else {
          let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
          values['projectName'] = project
          this.axios.request(this.api.postAdd, values).then((res:any) => {
            const { data } = res
            if (!JudgeUtil.isEmpty(data) && data.length > 0) {
              if (data.length > 1) {
                this.setState({ errorAry: data })
                this.handleBasicModalMore(1)
              } else {
                this.setState({ errorMsg: '该组织下已存在该岗位' })
                this.handleBasicModal(1)
              }
            } else {
              this.$message.success('新增成功！')
              this.handleModel() // 关闭，之后记得刷新
            }
            this.setState({ disableBtn: false })
          }).catch((err:any) => {
            const { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleBasicModal(1)
          })
        }
      }
    })
  }

  /** 对字段的大小进行排序 */
  sortParams = (values:any) => {
    const { setFieldsValue, getFieldValue } = this.props.form
    let keys = getFieldValue('keys')
    let ary:Array<any> = []
    keys.forEach((key:string) => {
      if (!JudgeUtil.isEmpty(values[`deadline${key}`])) {
        ary.push({
          deadline: values[`deadline${key}`],
          brokerage: values[`brokerage${key}`]
        })
      }
    })
    ary.sort((a:any, b:any) => {
      if (a.deadline > b.deadline) {
        return 1
      } else if (a.deadline < b.deadline) {
        return -1
      } else {
        return 0
      }
    })
    ary.forEach((el:any, num:number) => {
      values[`deadline${arySort[num]}`] = el.deadline
      values[`brokerage${arySort[num]}`] = el.brokerage
    })
  }

  /** 新增佣金的行 */
  changeItem = (num:number, keyd:number, e:any) => {
    const { setFieldsValue, getFieldValue } = this.props.form
    let { postInfo } = this.state
    let keys = getFieldValue('keys')
    if (num === 0 && !JudgeUtil.isEmpty(keyd)) {
      let obj:any = {
        keys: keys.filter((key:any) => key !== keyd)
      }
      obj[`deadline${keyd}`] = undefined
      obj[`brokerage${keyd}`] = undefined
      postInfo[`deadline${keyd}`] = undefined
      postInfo[`brokerage${keyd}`] = undefined
      this.setState({ postInfo })
      setFieldsValue(obj)
    } else {
      let ary = arySort.filter((el:any) => {
        return keys.indexOf(el) < 0
      })
      const nextKeys = keys.concat(ary[0])
      setFieldsValue({
        keys: nextKeys
      })
    }
  }

  /** 验证天数 */
  validateDeadline = (rule:any, value:any, callback:any) => {
    const { field } = rule // deadline
    const { getFieldValue, setFields } = this.props.form
    const keys = getFieldValue('keys')
    let reg = /^\d+$/
    if (value) {
      if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      }
      if (!JudgeUtil.isEmpty(value)) {
        let val = field.substring(8, value.length)
        let index = keys.indexOf(val)
        for (let i = 0; i < index + 1; i++) {
          let brokerage = getFieldValue(`brokerage${keys[i]}`)
          if (JudgeUtil.isEmpty(brokerage)) {
            let obj:any = {}
            obj[`brokerage${keys[i]}`] = { value: brokerage, errors: [new Error('请输入佣金金额')] }
            setFields(obj)
          }
        }
        for (let i = 0; i < index + 1; i++) {
          if (Number(value) <= Number(getFieldValue(`deadline${keys[i]}`)) && `deadline${keys[i]}` !== field) {
            callback(new Error('不能小于之前天数'))
            break
          }
        }
        for (let i = index; i < keys.length; i++) {
          if (Number(value) >= Number(getFieldValue(`deadline${keys[i]}`)) && `deadline${keys[i]}` !== field) {
            callback(new Error('不能大于之后天数'))
            break
          }
        }
      }
    }
    callback()
  }

  /** 验证佣金的信息 */
  valiDateBrokerage = (rule:any, value:any, callback:any) => {
    let reg = /^\d+$/
    if (value) {
      if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      }
    }
    const { getFieldValue, setFields } = this.props.form
    let suffer = rule.field.substring(9, rule.field.length)
    let deadline = getFieldValue(`deadline${suffer}`)
    if (deadline && JudgeUtil.isEmpty(value)) {
      callback(new Error('请输入佣金金额数字'))
    }
    callback()
  }

  /** 当前窗口的 开关 */
  handleModel = () => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.resetFields()
    if (onCancel) onCancel(false)
  }

  render () {
    const { form, pmId, type, visible } = this.props
    const { postInfo, errorMsg, arySortState, disableBtn, errorAry, clearData, visibleModal, visibleModalMore } = this.state
    const { getFieldDecorator, getFieldValue } = form
    getFieldDecorator('keys', { initialValue: arySortState })
    if (type === 'edit') getFieldDecorator('pmId', { initialValue: Number(pmId) })
    const keys = getFieldValue('keys')
    const { organize, postName } = postInfo
    const propsModal = {
      title: type === 'add' ? '新增' : '编辑',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel,
      footer: false,
      visible: visible
    }
    return (
      <Modal {...propsModal}>
        <Form {...latoutObj} onSubmit={this.submitHandel}>
          <Form.Item label='岗位名称'>
            {type === 'edit' ? postName : getFieldDecorator('postName', {
              initialValue: postName,
              rules: [
                { required: true, message: '请输入岗位名称' }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input allowClear maxLength={30} className='cus-input-220' placeholder='请输入岗位名称'/>
            )}
          </Form.Item>
          <Form.Item label='隶属架构' wrapperCol={{ span: type === 'edit' ? 16 : 12 }}>
            {type === 'edit' ? organize : getFieldDecorator('organize', {
              initialValue: organize ? [organize] : [],
              rules: [{ required: true, message: '请选择隶属架构' }]
            })(
              <SharedOrganization clearData={clearData} onClear={this.goClearOrgain} className='cus-input-220' input/>
            )}
          </Form.Item>
          <Form.Item label='推荐佣金'>
            {keys.map((el:any, key:number) => (
              <Row key={key}>
                <Col span={11}>
                  <Form.Item>
                    {getFieldDecorator(`deadline${el}`, {
                      initialValue: postInfo[`deadline${el}`] ? postInfo[`deadline${el}`] : undefined,
                      rules: [{ required: false, validator: this.validateDeadline }],
                      getValueFromEvent: ValidateUtil.getValueFromEventNumber
                    })(
                      <Input allowClear maxLength={3} className='cus-input-105' placeholder='请输入天数'/>
                    )}
                  </Form.Item>
                </Col>
                <Col span={11}>
                  <Form.Item>
                    {getFieldDecorator(`brokerage${el}`, {
                      initialValue: postInfo[`brokerage${el}`] ? postInfo[`brokerage${el}`] : undefined,
                      rules: [{ required: false, validator: this.valiDateBrokerage }],
                      getValueFromEvent: ValidateUtil.getValueFromEventNumber
                    })(
                      <Input allowClear maxLength={5} className='cus-input-105' placeholder='请输入金额'/>
                    )}
                  </Form.Item>
                </Col>
                {keys.length !== 1 && <Col span={1}>
                  <span className='post-icon'>
                    <Icon type='minus' onClick={this.changeItem.bind(this, 0, el)}/>
                  </span>
                </Col>}
              </Row>
            ))}
            {keys.length < 6 && <Row>
              <Col span={11}>
                <Button onClick={this.changeItem.bind(this, 1, -1)} className='cus-input-105'><Icon type='plus'/></Button>
              </Col>
            </Row>}
          </Form.Item>
          <Form.Item className='btn-inline-group' wrapperCol={{ span: 16, offset: 8 }}>
            <Button type='primary' disabled={disableBtn} htmlType='submit'>{type === 'edit' ? '修改' : '新增'}</Button>
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
          <BasicModal visible={visibleModalMore} onCancel={this.handleBasicModalMore} title="提示">
            <div className="model-error">
              <p>以下组织已存在该岗位</p>
              {errorAry.map((el:any, key:number) => (
                <p key={key}>{el}</p>
              ))}
            </div>
            <Row className='cus-modal-btn-top'>
              <Button onClick={this.handleBasicModalMore.bind(this, 0)} type="primary">确认</Button>
            </Row>
          </BasicModal>
        </Form>
      </Modal>
    )
  }
}

export default Form.create<PostAddOrEditProps>()(PostAddOrEdit)
