/**
 * @description 公司信息-岗位编辑
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import moment from 'moment'
import { RootComponent, BasicModal } from '@components/index'
import { Form, Input, Button, DatePicker, Select, Row } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from '@typings/global'
import { ValidateUtil, JudgeUtil, SysUtil, globalEnum } from '@utils/index'
import { inject, observer } from 'mobx-react'
import { industryCategoryAry, Info } from './components/info'

import './style/index.styl'

const { TextArea } = Input

interface EditPageProps extends FormComponentProps, BaseProps {
  mobxCommon?: any
}

interface EditPageState {
  // 公司的ID
  cId:number
  // 按钮禁用
  disableBtn:boolean
  // 保存用户的信息
  companyInfo: Info
  // 错误的消息
  errorMsg: string
  visibleModal: boolean
}

@inject('mobxCommon')
@observer
class EditPage extends RootComponent<EditPageProps, EditPageState> {
  constructor (props:EditPageProps) {
    super(props)
    this.state = {
      cId: props.match.params.id,
      disableBtn: false,
      companyInfo: new Info(),
      errorMsg: '',
      visibleModal: false
    }
  }

  componentDidMount () {
    const { cId } = this.state
    // 查询信息（修改）
    if (cId) {
      this.getDetail(cId)
    }
  }

  /** 获取到详细的信息 */
  getDetail = (cId:number) => {
    this.axios.request(this.api.companyDetail, { cId }).then((detail:any) => {
      this.setState({ companyInfo: detail.data })
    }).catch((err:any) => {
      const { msg } = err
      this.setState({ errorMsg: msg || err, disableBtn: false })
      this.handleBasicModal(1)
    })
  }

  /** 提交信息 */
  submitHandle = (e:any) => {
    e.preventDefault()
    const { cId } = this.state
    const { form } = this.props
    form.validateFields((err:any, values:any) => {
      if (!err) {
        this.setState({ disableBtn: true })
        let foundTime = values.foundTime
        if (foundTime instanceof moment) {
          values['foundTime'] = foundTime.valueOf()
        }
        if (!JudgeUtil.isEmpty(values.industryCategory)) {
          values['industryCategory'] = values.industryCategory.join('、')
        }
        values['userId'] = SysUtil.getLocalStorage(globalEnum.userID)
        if (cId) {
          values['cId'] = cId
          this.axios.request(this.api.companyUpdate, values).then((res:any) => {
            this.$message.success('修改成功！')
            this.setState({ disableBtn: false })
            // 跳转到公司界面
            this.goBack()
          }).catch((err:any) => {
            const { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleBasicModal(1)
          })
        } else {
          this.axios.request(this.api.companyAdd, values).then((res:any) => {
            this.$message.success('新增成功！')
            this.setState({ disableBtn: false })
            // 跳转到公司界面
            this.goBack()
          }).catch((err:any) => {
            const { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleBasicModal(1)
          })
        }
      }
    })
  }

  goBack = () => {
    this.props.history.push('/home/company/company')
  }

  /** 禁止的时间 */
  disabledDate = (current:any) => {
    return current && current > moment().endOf('day')
  }

  /** 是否显示错误的消息 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num !== 0 })
  }

  /** 联系方式的， 允许为空  */
  validateContactInformation = (rule:any, value:any, callback:any) => {
    if (value) {
      let regOne = /^1(3|4|5|6|7|8|9)\d{3,9}$/
      let regThere = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
      if (regOne.test(value) || regThere.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的联系方式'))
      }
    }
    callback()
  }

  /** 注册资本的 验证  允许为空 */
  validateSalary = (rule:any, value:any, callback:any) => {
    if (value) {
      let reg = /^\d+$/
      if (!reg.test(value)) {
        callback(new Error('请输入数字'))
      }
    }
    callback()
  }

  /** 名称 */
  validateName = (rule:any, value:any, callback:any) => {
    if (value) {
      let reg = /^\S[\u0391-\uFFE5a-zA-Z\s]+$/
      if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
        callback(new Error('请输入中文或英文'))
      }
    }
    callback()
  }

  render () {
    const { form: { getFieldDecorator }, mobxCommon: { projectAry } } = this.props
    const { companyInfo, errorMsg, disableBtn, visibleModal, cId } = this.state
    const layoutObj = {
      labelCol: { span: 3 },
      wrapperCol: { span: 6 }
    }
    let { foundTime, createTime, registeredCapital, abbreviation, address, phoneNumber, scale,
      companyName, industryCategory, introduce, legalPerson, nature, projectName } = companyInfo as Info
    if (cId) {
      if (createTime) getFieldDecorator('createTime', { initialValue: createTime })
      getFieldDecorator('companyName', { initialValue: companyName })
    }
    return (
      <div className='companyedit-content'>
        <Form {...layoutObj} onSubmit={this.submitHandle}>
          <Form.Item label='项目名称'>
            {getFieldDecorator('projectName', {
              initialValue: projectName,
              rules: [{ required: true, message: '请选择项目名称' }]
            })(
              <Select allowClear placeholder='请选择项目名称' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                {projectAry.map((el:any, key:number) => (
                  <Select.Option value={el.projectName} key={key}>{el.projectName}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label='公司名称'>
            {cId ? companyName || '---' : getFieldDecorator('companyName', {
              initialValue: companyName,
              rules: [
                { required: true, validator: ValidateUtil.validateName }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input allowClear maxLength={30} placeholder='请输入公司名称'></Input>
            )}
          </Form.Item>
          <Form.Item label='公司简称'>
            {getFieldDecorator('abbreviation', {
              initialValue: abbreviation,
              rules: [
                { required: false, validator: this.validateName }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input allowClear maxLength={10} placeholder='请输入公司简称'></Input>
            )}
          </Form.Item>
          <Form.Item label='公司地址'>
            {getFieldDecorator('address', {
              initialValue: address,
              rules: [
                { required: false, message: '请输入公司地址' }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input allowClear maxLength={30} placeholder='请输入公司地址'></Input>
            )}
          </Form.Item>
          <Form.Item label='联系方式'>
            {getFieldDecorator('phoneNumber', {
              initialValue: phoneNumber,
              rules: [
                { required: false, validator: this.validateContactInformation }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventFirstEmpty
            })(
              <Input allowClear maxLength={11} placeholder='请输入联系方式'></Input>
            )}
          </Form.Item>
          <Form.Item label='法人'>
            {getFieldDecorator('legalPerson', {
              initialValue: legalPerson,
              rules: [
                { required: false, validator: this.validateName }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventName
            })(
              <Input allowClear maxLength={30} placeholder='请输入法人姓名'></Input>
            )}
          </Form.Item>
          <Form.Item label='成立时间'>
            {getFieldDecorator('foundTime', {
              initialValue: foundTime ? moment(foundTime) : undefined,
              rules: [
                { required: false, message: '请选择成立时间' }
              ]
            })(
              <DatePicker className="cus-input" disabledDate={this.disabledDate} allowClear placeholder='请选择成立时间'/>
            )}
          </Form.Item>
          <Form.Item label='注册资本(万元)' className='edit-form-item'>
            {getFieldDecorator('registeredCapital', {
              initialValue: registeredCapital,
              rules: [
                { required: false, validator: this.validateSalary }
              ],
              getValueFromEvent: ValidateUtil.getValueFromEventNumber
            })(
              <Input allowClear maxLength={9} placeholder='请输入注册资本'></Input>
            )}
          </Form.Item>
          <Form.Item label='公司规模(人)'>
            {getFieldDecorator('scale', {
              initialValue: scale,
              rules: [
                { required: false, message: '请选择公司规模' }
              ]
            })(
              <Select allowClear placeholder='请选择公司规模' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                <Select.Option value='1000及以上'>1000及以上</Select.Option>
                <Select.Option value='500~999'>500~999</Select.Option>
                <Select.Option value='100~499'>100~499</Select.Option>
                <Select.Option value='50~99'>50~99</Select.Option>
                <Select.Option value='10~49'>10~49</Select.Option>
                <Select.Option value='10人以下'>10人以下</Select.Option>
              </Select>
            )}
          </Form.Item>
          <Form.Item label='公司性质'>
            {getFieldDecorator('nature', {
              initialValue: nature,
              rules: [
                { required: false, message: '请选择公司性质' }
              ]
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
          <Form.Item label='行业类别'>
            {getFieldDecorator('industryCategory', {
              initialValue: industryCategory ? industryCategory.split('、') : [],
              rules: [
                { required: false, message: '请选择行业类别' }
              ]
            })(
              <Select mode="multiple" allowClear placeholder='请选择行业类别' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                {industryCategoryAry.map((el:string, key:number) => (
                  <Select.Option value={el} key={key}>{el}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label='公司简介' wrapperCol={{ span: 13 }}>
            {getFieldDecorator('introduce', {
              initialValue: introduce,
              rules: [
                { required: false, message: '请输入公司简介' }
              ]
            })(
              <TextArea rows={10} maxLength={2000} placeholder="公司简介" />
            )}
          </Form.Item>
          <Form.Item wrapperCol={{ span: 20, offset: 3 }} className="search-btn btn-inline-group">
            <Button type='primary' disabled={disableBtn} htmlType="submit">{cId ? '保存' : '新增'}</Button>
            <Button onClick={this.goBack}>取消</Button>
          </Form.Item>
        </Form>
        <BasicModal title="提示" visible={visibleModal} onCancel={this.handleBasicModal}>
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          <Row className='cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModal>
      </div>
    )
  }
}

export default Form.create<EditPageProps>()(EditPage)
