/**
 * @description model 表单
 * @author minjie
 * @createTime 2019/05/14
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, Select, Button, Row, Cascader, Modal, Icon } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum, JudgeUtil, ValidateUtil } from '@utils/index'
import { inject, observer } from 'mobx-react'
import hot from 'react-hot-loader'

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 8 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } }
}

interface ModalFormProps extends FormComponentProps {
  onCancel?: Function
  visible?: boolean
  mobxCommon? : any
}

interface ModalFormState {
  // 组织的数组
  organizeAry: Array<any>
  // 组织的数组(总)
  organizeArySum: Array<any>
  // 合同主体
  subjectAry: Array<any>
  // 合同协议类型
  contractTypeAry: Array<any>
  // 岗位名称
  postDateAry: Array<any>
  // 错误消息
  errorMsg: string
  // 按钮禁用
  disabledBtn: boolean
  visibleModal: boolean
  spinIcon: boolean // 刷新旋转
}

@inject('mobxCommon')
@observer
class ModalForm extends RootComponent<ModalFormProps, ModalFormState> {
  constructor (props:ModalFormProps) {
    super(props)
    let organizeArySum = SysUtil.getLocalStorage(globalEnum.commonOrganize) || []
    this.state = {
      organizeAry: [],
      organizeArySum,
      subjectAry: [],
      postDateAry: [],
      contractTypeAry: [],
      errorMsg: '',
      disabledBtn: false,
      visibleModal: false,
      spinIcon: false
    }
  }

  timeout: any = null

  /** 初始化数据 */
  componentDidMount () {
    this.initSelectData()
  }

  /** 初始化数据 */
  initSelectData = () => {
    this.axios.request(this.api.companyGetCompanyName).then((b:any) => {
      this.setState({ subjectAry: b.data || [] })
    }).catch((err:any) => console.log(err))
  }

  /** 提交信息之前 */
  handleSubmitAfter = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        this.handleSubmit(values)
      }
    })
  }

  /** 提交信息 */
  handleSubmit = (data:any) => {
    // 创建人的Id
    data['createUser'] = SysUtil.getLocalStorage(globalEnum.userID)
    data['userOrganize'] = data['userOrganize'].join('-')
    this.setState({ disabledBtn: true })
    this.axios.request(this.api.queryNewAdd, data).then((res:any) => {
      this.setState({ disabledBtn: false })
      this.$message.success('新增成功！')
      this.handleModel(1) // 关闭，之后记得刷新
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ disabledBtn: false })
      if (msg && msg.length > 0 && msg[0] === '手机号非法') {
        this.props.form.setFields({ phoneNumber: { value: data.phoneNumber, errors: [new Error('手机号非法')] } })
      } else {
        this.setState({ errorMsg: msg || err })
        this.handleBasicModal(1)
      }
    })
  }

  /** 查询组织的信息 */
  projectChange = (value:any) => {
    let { organizeArySum, organizeAry } = this.state
    const { setFieldsValue } = this.props.form
    let ary = organizeArySum.find((el:any) => el.organize.indexOf(value) >= 0)
    organizeAry = ary ? [ary] : []
    setFieldsValue({ userOrganize: undefined })
    this.setState({ organizeAry })
  }

  /** 根据合同主体查询协议 */
  contractSubjectChange = (contractSubject:string) => {
    const { setFieldsValue } = this.props.form
    if (!JudgeUtil.isEmpty(contractSubject)) {
      this.axios.request(this.api.queryChangeTypeToSubject, {
        contractSubject
      }).then((res:any) => {
        this.setState({ contractTypeAry: res.data || [] })
      }).catch((err:any) => {
        console.log(err)
        this.setState({ contractTypeAry: [] })
      })
    } else {
      this.setState({ contractTypeAry: [] })
    }
    setFieldsValue({ contractType: undefined })
  }

  /** 部门选择之后 */
  onChangeCasCader = (value:any) => {
    if (value && value.length > 0) {
      this.axios.request(this.api.queryManagementByOrganizeTwo, {
        organize: value.join('-')
      }).then((res:any) => {
        const { data } = res
        this.setState({ postDateAry: data || [] })
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }

  /** 当前窗口的 开关 */
  handleModel = (num: number) => {
    const { onCancel } = this.props
    // 关闭窗口同时清除信息
    this.props.form.resetFields()
    if (onCancel) onCancel(false, num)
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 刷新组织的数据 */
  reloadData = () => {
    this.props.mobxCommon.setOrganize()
    this.setState({ spinIcon: true })
    this.timeout = setTimeout(() => {
      this.setState({ spinIcon: false })
    }, 1500)
  }

  componentWillUnmount () {
    if (this.timeout) clearTimeout(this.timeout)
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { organizeAry, subjectAry, postDateAry, contractTypeAry, disabledBtn, errorMsg, visibleModal, spinIcon } = this.state
    const { visible } = this.props
    const propsModal = {
      title: '新建员工',
      centered: true,
      maskClosable: false,
      onCancel: this.handleModel.bind(this, 0),
      footer: false,
      visible: visible
    }
    const { projectAry } = this.props.mobxCommon
    return (
      <Modal {...propsModal}>
        <Form {...formItemLayout} onSubmit={this.handleSubmitAfter}>
          <Form.Item label="姓名">
            {getFieldDecorator('userName', {
              rules: [
                { required: true, validator: ValidateUtil.validateName }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input type="text" maxLength={30} allowClear className="cus-input-197" placeholder="请输入姓名"></Input>
            )}
          </Form.Item>
          <Form.Item label="手机号">
            {getFieldDecorator('phoneNumber', {
              rules: [
                { required: true, validator: ValidateUtil.validatePhone }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventPhone
            })(
              <Input type="text" minLength={5} maxLength={11} allowClear className="cus-input-197" placeholder="请输入手机号"></Input>
            )}
          </Form.Item>
          <Form.Item label="项目">
            {getFieldDecorator('projectName', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Select allowClear className="cus-input-197" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                onChange={this.projectChange} placeholder="请选择">
                {projectAry.map((el:any, index:number) => (
                  <Select.Option key={index} value={el.projectName}>{el.projectName}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="部门" className="cus-select-autowidth">
            {getFieldDecorator('userOrganize', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Cascader changeOnSelect onChange={this.onChangeCasCader} options={organizeAry} className="cus-input-197"
                fieldNames={{ label: 'organize', value: 'organize', children: 'next' }}
                placeholder="请选择"></Cascader>
            )}
            <Icon type='reload' spin={spinIcon} style={{ position: 'absolute', right: -20, top: 2 }} onClick={this.reloadData}></Icon>
          </Form.Item>
          <Form.Item label="合同主体" className="cus-select-autowidth-240">
            {getFieldDecorator('contractSubject', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Select allowClear onChange={this.contractSubjectChange} getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                className="cus-input-197" placeholder="请选择">
                {subjectAry.map((el:any, index:number) => (
                  <Select.Option key={index} value={el}>{el}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="合同类型">
            {getFieldDecorator('contractType', {
              rules: [{ required: true, message: '请选择' }]
            })(
              <Select allowClear className="cus-input-197" placeholder="请选择" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                {contractTypeAry.map((el:any, key:number) => (
                  <Select.Option key={key} value={el}>{el}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="员工类型" >
            {getFieldDecorator('roleType', {
              initialValue: undefined,
              rules: [{ required: true, message: '请选择员工类型' }]
            })(
              <Select getPopupContainer={(triggerNode:any) => triggerNode.parentElement} className="cus-input-197" placeholder="请选择员工类型" allowClear>
                <Select.Option key="全职" value="全职">全职</Select.Option>
                <Select.Option key="实习生" value="实习生">实习生</Select.Option>
                <Select.Option key="小时工" value="小时工">小时工</Select.Option>
                <Select.Option key="劳务工" value="劳务工">劳务工</Select.Option>
                <Select.Option key="三方全职" value="三方全职">三方全职</Select.Option>
                <Select.Option key="个人承包" value="个人承包">个人承包</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label="岗位名称">
            {getFieldDecorator('postName', {
              rules: [{ required: true, message: '请选择岗位名称' }]
            })(
              <Select allowClear className="cus-input-197" placeholder="请选择岗位名称" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                {postDateAry.length > 0 && postDateAry.map((el:any, key:number) => (
                  <Select.Option key={key} value={el}>{el}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="薪资">
            {getFieldDecorator('maxSalary', {
              rules: [{ required: true, validator: ValidateUtil.validateSalary }],
              getValueFromEvent: ValidateUtil.getValueFromEventNumber
            })(<Input type="text" maxLength={6} allowClear className="cus-input-197" placeholder="请输入薪资"></Input>)}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 14, offset: 8 }} className="btn-inline-group">
            <Button type="primary" disabled={disabledBtn} htmlType="submit">新建</Button>
            <Button onClick={this.handleModel.bind(this, 0)}>取消</Button>
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

export default Form.create<ModalFormProps>({})(ModalForm)
