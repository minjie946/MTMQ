/**
 * @author minjie
 * @createTime 2019/07/12
 * @description 资讯新增编辑
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal, UploadImage } from '@components/index'
import { Form, Button, Select, Input, Row, Col, Checkbox } from 'antd'
import { JudgeUtil, SysUtil, globalEnum, OSSUtil, OssPathEnum } from '@utils/index'
import { controls, unitImportFn, unitExportFn, InformationInfo } from './components/info'
import { ProjectCheck } from '@shared/index'
import BraftEditor from 'braft-editor'
import { FormComponentProps } from 'antd/lib/form'
import { BaseProps } from 'typings/global'
import { inject, observer } from 'mobx-react'

import PreviewModal from './components/PreviewModal'

import 'braft-editor/dist/index.css'
import './style/editoradd.styl'

const layoutFrom = {
  labelCol: { span: 3 },
  wrapperCol: { span: 20 }
}

interface EditOrAddProps extends BaseProps, FormComponentProps {
  mobxCommon?:any
}

interface EditOrAddState {
  // 按钮的禁用
  disableBtn: boolean
  infoId: number
  // 详细信息
  informationInfo: InformationInfo
  // 错误消息
  errorMsg: string
  visibleModal: boolean
  visiblePrrview: boolean
  previewHtml: any
}

@inject('mobxCommon')
@observer
class EditOrAdd extends RootComponent<EditOrAddProps, EditOrAddState> {
  constructor (props:EditOrAddProps) {
    super(props)
    const { infoId } = this.props.match.params
    this.state = {
      disableBtn: false,
      infoId,
      informationInfo: new InformationInfo(),
      errorMsg: '',
      visibleModal: false,
      visiblePrrview: false,
      previewHtml: ''
    }
  }

  componentDidMount () {
    const { infoId } = this.state
    if (infoId) { // 查询详情
      this.getDetail(infoId)
    }
  }

  goBack = () => {
    this.props.history.replace('/home/company/information')
  }

  /** 错误的谭弹框的显示 */
  handleBasicModal = (number:number) => {
    this.setState({ visibleModal: number !== 0 })
  }

  getDetail = (infoId:number) => {
    this.axios.request(this.api.informationDetailToModify, { infoId }).then((res:any) => {
      const { data } = res
      this.setState({ informationInfo: data })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 提交信息 */
  handelSubmit = (e:any) => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        values['content'] = values.content.toHTML()
        if (typeof values.thumbnail === 'string') { // 不用进行修改
          this.ceremonialSubmit(values)
        } else {
          OSSUtil.uploadFileStream(values.thumbnail, OssPathEnum.information).then(({ name }:any) => {
            values['thumbnail'] = name
            this.ceremonialSubmit(values)
          }).catch((err:any) => {
            this.$message.error(JSON.stringify(err))
          })
        }
      }
    })
  }

  /** 正式的提交 */
  ceremonialSubmit = (values:InformationInfo) => {
    const { infoId } = this.state
    const { axios, api } = this
    this.setState({ disableBtn: true })
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    let infoIstop:any = values['infoIstop']
    values['userId'] = userId
    values['infoIstop'] = infoIstop.length > 0 && infoIstop[0] ? infoIstop[0] : false
    if (infoId) { // 修改
      values['infoId'] = infoId
      axios.request(api.informationUpdate, values).then((res:any) => {
        this.$message.success('修改成功！')
        this.setState({ disableBtn: false })
        this.goBack()
      }).catch((err:any) => {
        let { msg } = err
        this.setState({ errorMsg: msg || err, disableBtn: false })
        this.handleBasicModal(1)
      })
    } else { // 新增
      axios.request(api.informationAdd, values).then((res:any) => {
        this.$message.success('新增成功！')
        this.setState({ disableBtn: false })
        this.goBack()
      }).catch((err:any) => {
        let { msg } = err
        this.setState({ errorMsg: msg || err, disableBtn: false })
        this.handleBasicModal(1)
      })
    }
  }

  /** 富文本的预览 */
  preview = () => {
    const { getFieldValue } = this.props.form
    let editorState = getFieldValue('content')
    if (!JudgeUtil.isEmpty(editorState)) {
      this.setState({ previewHtml: editorState.toHTML() })
      this.visiblePrrviewModal(true)
    }
  }

  /** 转换HTMl */
  transformationHTML = (htmlContent:any) => {
    return BraftEditor.createEditorState(htmlContent)
  }

  /** 预览的信息 */
  visiblePrrviewModal = (visiblePrrview: boolean) => {
    this.setState({ visiblePrrview })
  }

  render () {
    const { mobxCommon: { projectAry }, form: { getFieldDecorator } } = this.props
    const { disableBtn, errorMsg, informationInfo, infoId, visibleModal, visiblePrrview, previewHtml } = this.state
    const { infoContent, infoState, infoThumbnail, infoThumbnailURL, infoTitle, infoType, infoIstop, projectName } = informationInfo
    const extendControls:any = [
      {
        key: 'custom-button',
        type: 'button',
        text: '预览',
        onClick: this.preview
      }
    ]
    return (
      <div className='cus-home-content'>
        <Form {...layoutFrom} onSubmit={this.handelSubmit}>
          <Row>
            <Col span={20}>
              <Form.Item label='类别' wrapperCol={{ span: 5 }} className='cus-from-item'>
                {getFieldDecorator('infoType', {
                  initialValue: infoType,
                  rules: [
                    { required: true, message: '请选择状态' }
                  ]
                })(
                  <Select placeholder='请选择状态' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                    <Select.Option value='我是上嘉人'>我是上嘉人</Select.Option>
                    <Select.Option value='我是合伙人'>我是合伙人</Select.Option>
                    <Select.Option value='感人事迹'>感人事迹</Select.Option>
                    <Select.Option value='花边爆料'>花边爆料</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='状态' wrapperCol={{ span: 5 }} className='cus-from-item'>
                {getFieldDecorator('infoState', {
                  initialValue: infoState || 0,
                  rules: [
                    { required: true, message: '请选择状态' }
                  ]
                })(
                  <Select placeholder='请选择状态' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                    <Select.Option value={0}>上架</Select.Option>
                    <Select.Option value={1}>下架</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='缩略图' wrapperCol={{ span: 5 }} className='cus-from-item'>
                {getFieldDecorator('thumbnail', {
                  initialValue: infoThumbnail,
                  rules: [
                    { required: true, message: '请上传图片' }
                  ]
                })(
                  <UploadImage imgURLs={infoThumbnailURL} proportion={{ width: 3, height: 2, company: '%' }} />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='文章标题' wrapperCol={{ span: 12 }} className='cus-from-item'>
                {getFieldDecorator('title', {
                  initialValue: infoTitle,
                  rules: [{ required: true, message: '请输入文章标题' }]
                })(
                  <Input allowClear maxLength={30} placeholder='请输入文章标题'/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='文章内容' wrapperCol={{ span: 12 }} className='cus-from-item'>
                {getFieldDecorator('content', {
                  initialValue: infoContent ? this.transformationHTML(infoContent) : this.transformationHTML(null),
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入正文内容' }
                  ]
                })(
                  <BraftEditor
                    className="editor-wrapper"
                    controls={controls}
                    converts={{ unitImportFn, unitExportFn }}
                    extendControls={extendControls}
                    placeholder="请输入正文内容"/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='所属项目' wrapperCol={{ span: 12 }} className='cus-from-item'>
                {getFieldDecorator('projectName', {
                  initialValue: projectName,
                  rules: [
                    { required: true, message: '请选择所属项目' }
                  ]
                })(
                  <ProjectCheck/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item label='是否置顶' wrapperCol={{ span: 12 }} className='cus-from-item'>
                {getFieldDecorator('infoIstop', {
                  initialValue: [infoIstop]
                })(
                  <Checkbox.Group>
                    <Checkbox value={true}>置顶</Checkbox>
                  </Checkbox.Group>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={20}>
              <Form.Item wrapperCol={{ span: 20, offset: 3 }} className='cus-from-item btn-inline-group'>
                <Button htmlType="submit" type='primary' disabled={disableBtn}>
                  {infoId ? '保存' : '新增'}
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
        <PreviewModal visible={visiblePrrview} html={previewHtml} onCancel={this.visiblePrrviewModal}/>
      </div>
    )
  }
}

export default Form.create<EditOrAddProps>()(EditOrAdd)
