/**
 * @description banner-recruit-招聘版
 * @author minjie
 * @createTime 2019/08/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { BaseProps } from '@typings/global'
import { FormComponentProps } from 'antd/lib/form'
import { Button, Row, Col, Form, Input, Radio, Select, Cascader } from 'antd'
import { RootComponent, BasicModal, UploadImage } from '@components/index'
import { OSSUtil, OssPathEnum, JudgeUtil, SysUtil, globalEnum } from '@utils/index'
import { inject, observer } from 'mobx-react'

import '../style/pay.styl'

const formItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 18 }
}

interface RecruitInformationProps extends BaseProps, FormComponentProps {}

interface RecruitInformationState {
  errorMsg: string
  visibleModal: boolean
  bannerAry: Array<any>
  postAry1: Array<any>
  postAry2: Array<any>
  postAry3: Array<any>
  postAry4: Array<any>
  postAry5: Array<any>
  disableBtn: boolean
  [key:string]: any
}

@inject('mobxCommon')
@observer
class RecruitInformation extends RootComponent<RecruitInformationProps, RecruitInformationState> {
  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0
  // 删除时的key
  removeKey: number = -1

  constructor (props:RecruitInformationProps) {
    super(props)
    this.state = {
      errorMsg: '',
      visibleModal: false,
      bannerAry: [],
      postAry1: [],
      postAry2: [],
      postAry3: [],
      postAry4: [],
      postAry5: [],
      disableBtn: false
    }
  }

  componentDidMount () {
    // 查询组织
    const { project, getOrganizeAry } = this.props.mobxCommon
    let projects = project || SysUtil.getLocalStorage(globalEnum.project)
    getOrganizeAry(projects)
    // 查询轮播图
    this.loadingList()
  }

  componentDidUpdate (prevProps: any) {
    let params = new URLSearchParams(this.props.location.search)
    let defaultActiveKey = params.get('type')
    let paramsPre = new URLSearchParams(prevProps.location.search)
    let defaultActiveKeyPre = paramsPre.get('type')
    if (defaultActiveKeyPre !== defaultActiveKey && defaultActiveKey === 'recruit') {
      this.loadingList()
    }
  }

  /** 查询存在的轮播图 */
  loadingList = () => {
    // 薪酬版/招聘版/合伙人版
    this.axios.request(this.api.bannerQuery, {
      applicationEdition: '招聘版'
    }).then((res:any) => {
      let bannerAry:any = res.data.map((el:any, key:number) => {
        let obj:any = {}
        obj[`actionTarget${key}`] = el.actionTarget
        obj[`sowingMapId${key}`] = el.sowingMapId
        obj[`sowingMapImgPath${key}`] = el.sowingMapImgPath
        obj[`sowingMapImgURL${key}`] = el.sowingMapImgURL
        obj[`sowingMapName${key}`] = el.sowingMapName
        obj[`organize${key}`] = el.organize
        obj[`targetPath${key}`] = el.targetPath
        obj[`postAry${key}`] = []
        this.organizeChange(key, el.organize || [], el.targetPath)
        return obj
      })
      if (bannerAry.length === 0) {
        let obj:any = {}
        obj['actionTarget0'] = 1
        obj['sowingMapId0'] = undefined
        obj['sowingMapImgPath0'] = undefined
        obj['sowingMapName0'] = undefined
        obj['targetPath0'] = undefined
        obj['postAry0'] = []
        bannerAry = [obj]
      }
      this.setState({ bannerAry })
    }).catch((err:any) => {
      this.handleModalKey = 0
      this.setState({ errorMsg: err.msg || err })
      this.handleModal(1)
    })
  }

  onChange = (key:number, e:any) => {
    let { bannerAry } = this.state
    bannerAry[key][`actionTarget${key}`] = e.target.value
    this.setState({ bannerAry })
  }

  /** 错误的谭弹框的显示 */
  handleModal = (num:number) => {
    if (num === 2) { // 删除数据
      this.remove()
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 添加/删除 轮播图 num: 1 新增 0 删除 keyd 对应的key */
  updateItem = (num:number, keyd:number) => {
    const { bannerAry } = this.state
    if (num === 0) {
      bannerAry.splice(keyd, 1)
      this.setState({ bannerAry })
    } else {
      let len = bannerAry.length
      let obj:any = {}
      obj[`actionTarget${len}`] = 1
      obj[`sowingMapId${len}`] = undefined
      obj[`sowingMapImgPath${len}`] = undefined
      obj[`sowingMapName${len}`] = undefined
      obj[`targetPath${len}`] = undefined
      obj[`postAry${len}`] = []
      bannerAry.push(obj)
      this.setState({ bannerAry })
    }
  }

  /** 移除之前 */
  removeAfter = (key:number) => {
    // 判断是移除数据还是说新增的移除
    this.removeKey = key
    const { getFieldValue } = this.props.form
    const sowingMapId = getFieldValue(`sowingMapId${key}`)
    if (JudgeUtil.isEmpty(sowingMapId)) { // 直接移除
      this.updateItem(0, key)
    } else { // 提醒是否移除
      this.setState({ errorMsg: `是否移除【轮播图${key + 1}】轮播图？` })
      this.handleModalKey = 2 // 删除
      this.handleModal(1)
    }
  }

  /** 删除数据 */
  remove = () => {
    const { getFieldValue } = this.props.form
    const sowingMapId = getFieldValue(`sowingMapId${this.removeKey}`)
    this.axios.request(this.api.bannerRemove, {
      applicationEdition: '招聘版',
      sowingMapId
    }).then((res:any) => {
      this.$message.success('移除成功！')
      this.loadingList()
    }).catch((err:any) => {
      this.handleModalKey = 0
      this.setState({ errorMsg: err.msg || err })
      this.handleModal(1)
    })
  }

  /** 提交信息 */
  handleSubmit = (key:number) => {
    const { getFieldValue, validateFieldsAndScroll } = this.props.form
    let fieldNames:Array<string> = [`actionTarget${key}`, `sowingMapId${key}`, `targetPath${key}`, `sowingMapImgPath${key}`]
    let actionTarget = getFieldValue(`actionTarget${key}`)
    if (actionTarget === 2) {
      fieldNames.push(`organize${key}`)
    }
    validateFieldsAndScroll(fieldNames, (err:any, values:any) => {
      if (!err) {
        const sowingMapId = values[`sowingMapId${key}`]
        if (sowingMapId) { // 修改
          let sowingMapImgPath = values[`sowingMapImgPath${key}`]
          this.setState({ disableBtn: true })
          if (typeof sowingMapImgPath === 'string') {
            this.submitData(this.api.bannerUpdate, {
              sowingMapId,
              actionTarget: values[`actionTarget${key}`],
              applicationEdition: '招聘版',
              organize: values[`organize${key}`],
              sowingMapImgPath: sowingMapImgPath,
              sowingMapName: `薪酬轮播图${key + 1}`,
              targetPath: values[`targetPath${key}`]
            })
          } else {
            OSSUtil.uploadFileStream(values[`sowingMapImgPath${key}`], OssPathEnum.banner).then(({ name }:any) => {
              this.submitData(this.api.bannerUpdate, {
                sowingMapId,
                actionTarget: values[`actionTarget${key}`],
                applicationEdition: '招聘版',
                sowingMapImgPath: name,
                organize: values[`organize${key}`],
                sowingMapName: `薪酬轮播图${key + 1}`,
                targetPath: values[`targetPath${key}`]
              })
            }).catch((err:any) => {
              this.handleModalKey = 0
              this.setState({ errorMsg: JSON.stringify(err), disableBtn: false })
              this.handleModal(1)
            })
          }
        } else { // 新增
          this.setState({ disableBtn: true })
          OSSUtil.uploadFileStream(values[`sowingMapImgPath${key}`], OssPathEnum.banner).then(({ name }:any) => {
            this.submitData(this.api.bannerAdd, {
              actionTarget: values[`actionTarget${key}`],
              applicationEdition: '招聘版',
              sowingMapImgPath: name,
              organize: values[`organize${key}`],
              sowingMapName: `薪酬轮播图${key + 1}`,
              targetPath: values[`targetPath${key}`]
            })
          }).catch((err:any) => {
            this.handleModalKey = 0
            this.setState({ errorMsg: JSON.stringify(err), disableBtn: false })
            this.handleModal(1)
          })
        }
      }
    })
  }

  /** 提交信息 */
  submitData = (url:any, values:any) => {
    this.axios.request(url, values).then((res:any) => {
      this.$message.success('保存成功！')
      this.setState({ disableBtn: false })
      this.loadingList()
    }).catch((err:any) => {
      this.handleModalKey = 0
      this.setState({ errorMsg: err.msg || err, disableBtn: false })
      this.handleModal(1)
    })
  }

  /** 根据组织查询 岗位的信息 */
  organizeChange = (key:number, value:any, targetPath?:any) => {
    if (value && value.length > 0) {
      const { bannerAry } = this.state
      // const { setFieldsValue } = this.props.form
      this.axios.request(this.api.bannerQueryPost, {
        organize: value.join('-')
      }).then(({ data }:any) => {
        let objs:any = {}
        // objs[`targetPath${key}`] = undefined
        // setFieldsValue(objs)
        let obj:any = {}
        obj[`postAry${(key + 1)}`] = data || []
        this.setState(obj)
      }).catch((err:any) => {
        console.log(err)
      })
    }
  }

  render () {
    const { errorMsg, visibleModal, bannerAry, disableBtn } = this.state
    const { getFieldDecorator } = this.props.form
    const { organizeAry } = this.props.mobxCommon
    // actionTarget 0 资讯 1 URL 2 岗位 3 小程序
    return (
      <div className='banner-pay-page'>
        {bannerAry.map((el:any, key:number) => (
          <Form {...formItemLayout} key={key}>
            {getFieldDecorator(`sowingMapId${key}`, { initialValue: el[`sowingMapId${key}`] })(<span></span>)}
            <Row className='row-margin-bottom'>
              <div className='banner-line'></div>
              <span className='banner-title'>轮播图/{key + 1}</span>
              {bannerAry.length !== 1 && <span className='banner-text' onClick={this.removeAfter.bind(this, key)}>移除</span>}
            </Row>
            <Row>
              <Col span={9}>
                <Form.Item label="图片">
                  {getFieldDecorator('sowingMapImgPath' + key, {
                    initialValue: el[`sowingMapImgPath${key}`],
                    rules: [{ required: true, message: '请选择' }]
                  })(
                    <UploadImage imgURLs={el[`sowingMapImgURL${key}`]} proportion={{ width: 690, height: 280, company: 'px' }} />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={9}>
                <Form.Item label="跳转链接">
                  {getFieldDecorator('actionTarget' + key, {
                    initialValue: el[`actionTarget${key}`],
                    rules: [{ required: true, message: '请选择' }]
                  })(
                    <Radio.Group onChange={this.onChange.bind(this, key)}>
                      <Radio value={1}>外部链接</Radio>
                      <Radio value={2}>内部链接</Radio>
                    </Radio.Group>
                  )}
                </Form.Item>
              </Col>
            </Row>
            <Row>
              {el[`actionTarget${key}`] === 1 ? <Col span={9}>
                <Form.Item wrapperCol={{ span: 18, offset: 5 }}>
                  {getFieldDecorator('targetPath' + key, {
                    initialValue: el[`targetPath${key}`],
                    rules: [{ type: 'url', required: true, message: '请输入URL地址' }]
                  })(
                    <Input className='cus-input-375' placeholder="请输入url地址"></Input>
                  )}
                </Form.Item>
              </Col> : <Col span={9}>
                <Form.Item label='部门' className='cus-input'>
                  {getFieldDecorator('organize' + key, {
                    initialValue: el[`organize${key}`],
                    rules: [{ required: true, message: '请选择部门' }]
                  })(
                    <Cascader changeOnSelect onChange={this.organizeChange.bind(this, key)} options={organizeAry}
                      fieldNames={{ label: 'organize', value: 'organize', children: 'next' }}
                      placeholder="请选择部门" />
                  )}
                </Form.Item>
                <Form.Item label='岗位' className='cus-from-item'>
                  {getFieldDecorator('targetPath' + key, {
                    initialValue: el[`targetPath${key}`] && !isNaN(Number(el[`targetPath${key}`])) ? Number(el[`targetPath${key}`]) : undefined,
                    rules: [{ required: true, message: '请选择' }]
                  })(
                    <Select allowClear placeholder='请选择岗位名称' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                      {this.state[`postAry${(key + 1)}`].map((el:any) => (
                        <Select.Option key={el.prId} value={el.prId}>{el.postName}</Select.Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </Col>}
            </Row>
            <Row>
              <Col span={9} className='btn-inline-group'>
                <Form.Item wrapperCol={{ span: 18, offset: 5 }}>
                  <Button disabled={disableBtn} type='primary' onClick={this.handleSubmit.bind(this, key)}>保存</Button>
                  {bannerAry.length < 5 && key === bannerAry.length - 1 && <Button type='primary' onClick={this.updateItem.bind(this, 1, -1)}>新增轮播图</Button>}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        ))}
        <BasicModal visible={visibleModal} onCancel={this.handleModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
          </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            <Button onClick={this.handleModal.bind(this, 0)}>取消</Button>
          </Row>}
        </BasicModal>
      </div>
    )
  }
}

export default Form.create<RecruitInformationProps>()(RecruitInformation)
