/**
 * @description 晋升通道查看
 * @author maqian
 * @createTime 2019/07/11
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import { Form, Button, Row, Col, Input, Select, Cascader } from 'antd'
import { RootComponent, BasicModal } from '@components/index'
import { PromotionInfo } from './components/PostInfo'
import { JudgeUtil, ValidateUtil, SysUtil, globalEnum } from '@utils/index'
import { inject, observer } from 'mobx-react'

import './style/detail.styl'

const { TextArea } = Input
const arySort = ['One', 'Two', 'Three']

const formItemLayout = { labelCol: { span: 3 }, wrapperCol: { span: 21 } }

interface AllDetailPageProps extends FormComponentProps, BaseProps {
  templateId: number
  type: 'edit' | 'add'
}

interface AllDetailPageState {
  // 错误消息
  errorMsg: string
  postInfo: any
  // 按钮的禁用
  disableBtn: boolean
  // 岗位
  postAry: Array<any>
  // 类型： 增加/编辑
  type:string
  templateId:any
  arySortState: Array<string>
  visibleModal: boolean
}
@inject('mobxCommon')
@observer
class AllDetailPage extends RootComponent<AllDetailPageProps, AllDetailPageState> {
  /** 保存所有的值组织 */
  private organizeArySum: Array<any> = SysUtil.getLocalStorage(globalEnum.commonOrganize) || []
  constructor (props:AllDetailPageProps) {
    super(props)
    const { location } = props
    let params = new URLSearchParams(location.search)
    this.state = {
      type: params.get('type') || 'add',
      templateId: Number(params.get('templateId')) || null,
      errorMsg: '',
      postInfo: new PromotionInfo(),
      disableBtn: false,
      arySortState: ['One'],
      postAry: [],
      visibleModal: false
    }
  }

  componentDidMount () {
    const { type, templateId } = this.state
    if (type === 'edit') {
      this.getDetail(templateId)
    } else {
      let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
      this.projectChange(project)
    }
  }

  /** 项目改变 查询组织的信息 */
  projectChange = (value:any) => {
    this.props.mobxCommon.getOrganizeAry(value)
    // let { organizeAry } = this.state
    // let ary = this.organizeArySum.find((el:any) => el.organize.indexOf(value) >= 0)
    // organizeAry = ary ? [ary] : []
    // this.setState({ organizeAry, postAry: [] })
  }

  /** 获取用户的信息 */
  getDetail = (templateId :any) => {
    this.axios.request(this.api.PromotionDetailInfo, { templateId }).then((res:any) => {
      const { data } = res
      let arySortState = arySort.filter((el:string) => {
        let val = data[`postName${el}`]
        return !JudgeUtil.isEmpty(val) && val !== 0
      })
      const { projectName } = data
      this.projectChange(projectName)
      this.setState({ postInfo: data, arySortState })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 错误的弹框 number: 0 关闭, 1 开启 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 当前窗口的 开关 */
  handleModel = (number:number) => {
    const { handleModel } = this.props
    if (handleModel) handleModel(number)
  }

  /** 提交 */
  handleSumbit = (e:any) => {
    e.preventDefault()
    const { form } = this.props
    const { type, templateId } = this.state
    form.validateFields((err:any, values:any) => {
      if (!err) {
        this.sortParams(values)
        this.setState({ disableBtn: true })
        delete values.keys
        values['userId'] = SysUtil.getLocalStorage(globalEnum.userID)
        if (type === 'edit') {
          delete values.postName
          values['templateId'] = templateId
          this.axios.request(this.api.PromotionDetailEdit, values).then((res:any) => {
            this.setState({ disableBtn: false })
            this.$message.success('修改成功！')
            this.props.history.push('/home/company/promotion')
          }).catch((err:any) => {
            const { msg } = err
            this.setState({ errorMsg: msg || err, disableBtn: false })
            this.handleBasicModal(1)
          })
        } else {
          this.axios.request(this.api.PromotionDetailAdd, values).then((res:any) => {
            this.$message.success('新增成功！')
            this.props.history.push('/home/company/promotion')
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
      ary.push({
        postName: values[`postName${key}`],
        postDescribe: values[`postDescribe${key}`]
      })
      delete values[`postName${key}`]
      delete values[`postDescribe${key}`]
    })
    ary.forEach((el:any, num:number) => {
      values[`postName${arySort[num]}`] = el.postName
      values[`postDescribe${arySort[num]}`] = el.postDescribe
    })
  }
  /** 取消 */
  handleCancel = (e:any) => {
    e.preventDefault()
    this.props.history.push('/home/company/promotion')
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
      obj[`postName${keyd}`] = undefined
      obj[`postDescribe${keyd}`] = undefined
      postInfo[`postName${keyd}`] = undefined
      postInfo[`postDescribe${keyd}`] = undefined
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
  /** 初始化部门 */
  initOrganize = (value:any) => {
    const { templateId } = this.state
    if (templateId) {
      return !JudgeUtil.isEmpty(value) ? value.split('-') : []
    } else {
      return !JudgeUtil.isEmpty(value) ? value : []
    }
  }
  /** 根据组织查询 岗位的信息 */
  organizeChange = (value:any) => {
    const { setFieldsValue } = this.props.form
    if (value.length > 0) {
      this.axios.request(this.api.PromotionList, {
        organize: value.join('-')
      }).then(({ data }:any) => {
        setFieldsValue({ postName: undefined })
        this.setState({ postAry: data || [] })
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }
  render () {
    const { getFieldDecorator, getFieldValue } = this.props.form
    const { errorMsg, postInfo, disableBtn, arySortState, type, postAry, visibleModal } = this.state
    const { templateId, organize, postName, templateName } = postInfo
    getFieldDecorator('keys', { initialValue: arySortState })
    if (templateId) getFieldDecorator('templateId', { initialValue: Number(templateId) })
    const keys = getFieldValue('keys')
    const { organizeAry } = this.props.mobxCommon
    return (
      <Form layout="inline" {...formItemLayout} onSubmit={this.handleSumbit} className='promotion-page'>
        <Row className='form-item-margin-40'>
          <Col span={12}>
            <Form.Item label="模板名称" className='cus-from-item'>
              {getFieldDecorator('templateName', {
                initialValue: templateName,
                rules: [{ required: true, validator: ValidateUtil.validateChEnNumber }],
                getValueFromEvent: ValidateUtil.getValueFromEventName
              })(
                <Input placeholder='请输入模板名称' maxLength={30} allowClear className='input-width' />
              )}
            </Form.Item>
          </Col>
          <Col span={4} offset={8}>
            <Form.Item wrapperCol={{ span: 24 }} className='cus-from-item btn-inline-group'>
              <Button type='primary' disabled={disableBtn} htmlType='submit'>{type === 'edit' ? '保存' : '添加'}</Button>
              <Button onClick={this.handleCancel}>取消</Button>
            </Form.Item>
          </Col>
        </Row>
        <Row className='form-item-margin-20'>
          <Col span={12}>
            <Form.Item label='部门' wrapperCol={{ span: 18 }} className='cus-input'>
              {getFieldDecorator('organize', {
                initialValue: organize,
                rules: [{
                  required: true,
                  message: '请选择部门'
                }]
              })(
                <Cascader changeOnSelect onChange={this.organizeChange} options={organizeAry}
                  fieldNames={{ label: 'organize', value: 'organize', children: 'next' }}
                  placeholder='请选择部门' className='input-width' />
              )}
            </Form.Item>
          </Col>
        </Row>
        {
          keys.map((el:any, key:number) => (
            <div key={key}>
              <Row className='form-item-margin-25'>
                <Col span={7}>
                  {
                    key === 0
                      ? <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={`P${key + 1}级岗位`} className='cus-from-item'>
                        {getFieldDecorator(`postName${el}`, {
                          initialValue: postInfo[`postName${el}`] || undefined,
                          rules: [{
                            required: true,
                            message: '请选择岗位名称'
                          }]
                        })(
                          <Select allowClear placeholder='请选择岗位名称' getPopupContainer={(triggerNode:any) => triggerNode.parentElement} className='input-width'>
                            {postAry.map((el:any) => (
                              <Select.Option key={el.pmId} value={`${el.pmId + '-' + el.postName}`}>{el.postName}</Select.Option>
                            ))}
                          </Select>
                        )}
                      </Form.Item>
                      : <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} label={`P${key + 1}级岗位`} className='cus-from-item'>
                        {getFieldDecorator(`postName${el}`, {
                          initialValue: postInfo[`postName${el}`] || null,
                          rules: [{ required: true, validator: ValidateUtil.validateChEnNumber }],
                          getValueFromEvent: ValidateUtil.getValueFromEventName
                        })(
                          <Input placeholder='请输入岗位名称' maxLength={30} allowClear className='input-width' />
                        )}
                      </Form.Item>
                  }
                </Col>
                {
                  key !== 0 &&
                  <Col span={4} offset={3}>
                    <Button type="danger" ghost onClick={this.changeItem.bind(this, 0, el)}>移除</Button>
                  </Col>
                }
              </Row>
              <Row className='form-item-margin-40'>
                <Col span={12}>
                  <Form.Item label="岗位描述" className='cus-from-item'>
                    {getFieldDecorator(`postDescribe${el}`, {
                      initialValue: postInfo[`postDescribe${el}`],
                      rules: [{
                        required: true,
                        message: '请填写岗位描述'
                      }]
                    })(
                      <TextArea autosize={{ minRows: 4, maxRows: 5 }} maxLength={500} style={{ width: '90%' }} placeholder='请输入岗位描述'></TextArea >
                    )}
                  </Form.Item>
                </Col>
              </Row>
            </div>
          ))
        }
        {
          keys.length < 3 &&
          <Row>
            <Col span={23} offset={1}>
              <Form.Item wrapperCol={{ span: 24 }} className='cus-from-item btn-inline-group'>
                <Button type="primary" onClick={this.changeItem.bind(this, 1, -1)}>新增</Button>
              </Form.Item>
            </Col>
          </Row>
        }
        <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          <Row className='cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModal>
      </Form>
    )
  }
}

export default Form.create<AllDetailPageProps>()(AllDetailPage)
