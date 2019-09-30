/**
 * @description 新增项目
 * @author minjie
 * @createTime 2019/08/06
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { FormComponentProps } from 'antd/lib/form'
import { RootComponent, BasicModal, UploadImage } from '@components/index'
import { BaseProps } from '@typings/global'
import { Form, Button, Row, Col, Input, Select } from 'antd'
import { ValidateUtil, OSSUtil, OssPathEnum } from '@utils/index'
import moment from 'moment'

const layoutFrom = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 }
}

interface AddOrEditProps extends BaseProps, FormComponentProps{
}

interface AddOrEditState {
  /** 修改时候的项目ID */
  projectId: string | number
  /** 按钮的禁用 */
  disableBtn: boolean
  /** 错误的消息 */
  errorMsg: string
  /** 错误的弹窗的显示隐藏 */
  visibleModal: boolean
  /** 用户的信息 */
  projectInfo: any
  /** 保存组织的信息 */
  organizationAry: Array<any>
}

class AddOrEdit extends RootComponent<AddOrEditProps, AddOrEditState> {
  constructor (props:AddOrEditProps) {
    super(props)
    let { id } = this.props.match.params
    this.state = {
      projectId: id,
      disableBtn: false,
      errorMsg: '',
      visibleModal: false,
      projectInfo: {},
      organizationAry: []
    }
  }

  componentDidMount () {
    let { projectId } = this.state
    if (projectId) { // 查询详情的信息
      this.getDetail(projectId)
    }
    // 获取第一级的组织
    this.getOrganizationAry()
  }

  /** 错误的弹窗的显示 */
  handleBasicModal = (num: number) => {
    this.setState({ visibleModal: num === 1 })
  }

  /** 返回上一页 */
  goBack = () => {
    this.props.history.replace('/home/company/project')
  }

  /** 获取组织的数据 */
  getOrganizationAry = () => {
    this.axios.request(this.api.projectGetOrganizationAry).then((res:any) => {
      this.setState({ organizationAry: res.data || [] })
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 获取项目的详细信息 */
  getDetail = (projectId:number| string) => {
    this.axios.request(this.api.projectDetail, { projectId }).then((res:any) => {
      this.setState({ projectInfo: res.data || {} })
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 提交信息 */
  handleSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        const { projectId, projectInfo } = this.state
        this.setState({ disableBtn: true })
        let { projectBanner } = values
        if (projectBanner && typeof projectBanner !== 'string') {
          OSSUtil.uploadFileStream(projectBanner, OssPathEnum.project).then(({ name }:any) => {
            values['projectBanner'] = name
            if (projectId) {
              values['projectId'] = projectId
              if (projectInfo.zoId === values.zoId) {
                delete values.zoId
              }
              this.submitData(projectId, this.api.projectEdit, values)
            } else {
              this.submitData(projectId, this.api.projectAdd, values)
            }
          }).catch((err:any) => {
            this.setState({ errorMsg: JSON.stringify(err), disableBtn: false })
            this.handleBasicModal(1)
          })
        } else {
          if (projectId) {
            values['projectId'] = projectId
            if (projectInfo.zoId === values.zoId) {
              delete values.zoId
            }
            this.submitData(projectId, this.api.projectEdit, values)
          } else {
            this.submitData(projectId, this.api.projectAdd, values)
          }
        }
      }
    })
  }

  /** 提交项目 */
  submitData = (projectId: any, url:any, params:any) => {
    this.axios.request(url, params).then(() => {
      this.$message.success(projectId ? '修改成功！' : '新增成功！')
      this.setState({ disableBtn: false })
      this.goBack()
    }).catch((err:any) => {
      let { msg } = err
      this.setState({ errorMsg: msg || err, disableBtn: false })
      this.handleBasicModal(1)
    })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { projectId, visibleModal, errorMsg, disableBtn, projectInfo, organizationAry } = this.state
    // 姓名  手机号 项目BANNER 项目描述 项目名称 用户ID 组织架构
    const { connectionUser, phoneNumber, projectBanner, projectBannerUrl, projectDescribe, projectName, userId, zoId, createTime } = projectInfo
    return (
      <div className='cus-home-content'>
        <Form {...layoutFrom} onSubmit={this.handleSubmit}>
          {projectId && <Row>
            <Col span={10}>
              <Form.Item label='创建时间'>
                {createTime && moment(createTime).format('YYYY-MM-DD')}
              </Form.Item>
            </Col>
          </Row>}
          <Row>
            <Col span={10}>
              <Form.Item label='项目名称'>
                {projectId ? (projectName || '---') : getFieldDecorator('projectName', {
                  initialValue: projectName,
                  rules: [{ required: true, validator: ValidateUtil.validateName }],
                  getValueFromEvent: ValidateUtil.getValueFromEventName
                })(
                  <Input allowClear maxLength={30} placeholder='项目名称' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label='联系人'>
                {getFieldDecorator('connectionUser', {
                  initialValue: connectionUser,
                  rules: [{ required: true, validator: ValidateUtil.validateName }],
                  getValueFromEvent: ValidateUtil.getValueFromEventName
                })(
                  <Input allowClear maxLength={30} placeholder='联系人' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label='联系电话'>
                {getFieldDecorator('phoneNumber', {
                  initialValue: phoneNumber,
                  rules: [{ required: true, validator: ValidateUtil.validatePhone }],
                  getValueFromEvent: ValidateUtil.getValueFromEventPhone
                })(
                  <Input allowClear maxLength={11} minLength={5} placeholder='联系电话' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label='APP首页图片'>
                {getFieldDecorator('projectBanner', {
                  initialValue: projectBanner,
                  rules: [{ required: true, message: '请上传图片' }]
                })(
                  <UploadImage imgURLs={projectBanner && projectBannerUrl} proportion={{ width: 16, height: 9, company: '%' }} width={320} height={180}/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label='介绍界面'>
                {getFieldDecorator('projectDescribe', {
                  initialValue: projectDescribe,
                  rules: [{ type: 'url', required: true, message: '请输入URL地址' }]
                })(
                  <Input allowClear placeholder='介绍界面' />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item label='组织'>
                {getFieldDecorator('zoId', {
                  initialValue: zoId,
                  rules: [{ required: true, message: '请选择组织' }]
                })(
                  <Select allowClear placeholder='请选择组织' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                    {organizationAry.map((el:any, index:number) => (
                      <Select.Option key={index} value={el.orId}>{el.organize}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <Form.Item wrapperCol={{ span: 20, offset: 4 }} className='cus-from-item btn-inline-group'>
                <Button htmlType="submit" type='primary' disabled={disableBtn}>
                  {projectId ? '保存' : '新增'}
                </Button>
                <Button htmlType="button" onClick={this.goBack}>返回</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
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

export default Form.create<AddOrEditProps>()(AddOrEdit)
