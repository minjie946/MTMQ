/**
 * @description 在招岗位-新增编辑
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Form, Input, Cascader, Row, Col, Select, Icon } from 'antd'
import { BaseProps } from 'typings/global'
import { FormComponentProps } from 'antd/lib/form'
import { PostInfo } from '../components/info'
import LabelItem from '../components/labelItem'
import { inject, observer } from 'mobx-react'
import { JudgeUtil, SysUtil, ValidateUtil, globalEnum } from '@utils/index'

const { TextArea } = Input

interface RecruitmentEditOrAddProps extends FormComponentProps, BaseProps {
  mobxCommon?:any
}

interface RecruitmentEditOrAddState {
  prId:number
  // 错误的消息
  errorMsg: string
  // 按钮的禁用
  disableBtn: boolean
  // 保存岗位的信息
  postInfo: PostInfo
  // 合同类型
  contractTypeAry: Array<any>
  // 城市
  cityAry:Array<any>
  // 岗位
  postAry: Array<any>
  // 结算方式
  clearingFormAry:Array<string>
  // 电子模板
  InterviewAry: Array<any>
  // 是日结还是月结
  isClearingForm: boolean
  visibleModal: boolean
  spinIcon: boolean // 刷新旋转
}

@inject('mobxCommon')
@observer
class RecruitmentEditOrAdd extends RootComponent<RecruitmentEditOrAddProps, RecruitmentEditOrAddState> {
  constructor (props:RecruitmentEditOrAddProps) {
    super(props)
    const { prId } = this.props.match.params
    this.state = {
      prId,
      errorMsg: '',
      disableBtn: false,
      postInfo: new PostInfo(),
      cityAry: [],
      postAry: [],
      InterviewAry: [],
      contractTypeAry: [],
      clearingFormAry: [],
      isClearingForm: false,
      visibleModal: false,
      spinIcon: false
    }
  }

  /** 保存 月结方式的 */
  private clearingFormSum:Array<any> = []

  timeout:any = null

  componentDidMount () {
    const { prId } = this.state
    if (prId) { // 修改
      SysUtil.clearSession('recruitmentInfo')
      this.getDetail(prId)
    } else {
      let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
      this.projectChange(project)
      this.props.mobxCommon.getCompanyNamePro(project)
    }
    this.initSelectData()
  }

  /** 初始化数据 */
  initSelectData = () => {
    let { axios, request } = this.axios
    // 城市 项目 主体 电子模板
    const { recruitmentCity, interviewInterviewList } = this.api
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    axios.all([
      request(recruitmentCity),
      request(interviewInterviewList, { userId })
    ]).then(axios.spread((a:any, d:any) => {
      let cityAry = JSON.parse(a.data)
      if (!JudgeUtil.isEmpty(cityAry)) {
        cityAry = cityAry.provinceObjList
      } else {
        cityAry = []
      }
      let InterviewAry = d.data || []
      this.setState({
        cityAry,
        InterviewAry
      })
    })).catch((err:any) => console.log(err))
  }

  /** 修改的时候初始 */
  initEditData = () => {
    const { contractSubject, contractType, clearingForm, projectName } = this.state.postInfo
    this.projectChange(projectName)
    if (contractSubject && contractType && clearingForm) {
      this.subjectChange('edit', contractSubject)
      this.contractTypeChange('edit', contractType)
    }
    this.props.mobxCommon.getCompanyNamePro(projectName)
  }

  /** 获取详细的信息 */
  getDetail = (prId:number) => {
    this.axios.request(this.api.recruitmentDetail, { prId: Number(prId) }).then((res:any) => {
      const { data } = res
      this.setState({ postInfo: data })
      this.initEditData()
    }).catch(err => console.log(err))
  }

  /** 提交信息 */
  handleSubmit = (e:any) => {
    e.preventDefault()
    const { postInfo } = this.state
    this.props.form.validateFieldsAndScroll((err:any, values:any) => {
      if (!err) {
        this.setState({ disableBtn: true })
        // 岗位特色 postFeature
        values['postFeature'] = values.postFeature.join(',')
        // 岗位要求 postRequirement
        values['postRequirement'] = values.postRequirement.join(',')
        // 城市 city
        values['province'] = values.cityd[0]
        values['city'] = values.cityd[1]
        values['district'] = values.cityd[2]
        this.getAddress(values['workAddress']).then(({ storeLongitude, storeLatitude }:any) => {
          values['storeLatitude'] = storeLatitude
          values['storeLongitude'] = storeLongitude
          this.submitData(values)
        }).catch((err:any) => {
          console.log(err)
          this.setState({ disableBtn: false })
        })
      }
    })
  }

  submitData = (values:any) => {
    const { prId } = this.state
    const { axios, api } = this
    values['userId'] = SysUtil.getLocalStorage(globalEnum.userID)
    if (values['electronInterviewId'] === 'd1000') {
      values.electronInterviewId = null
    }
    if (prId) {
      axios.request(api.recruitmentEdit, values).then((res:any) => {
        this.$message.success('修改成功！')
        this.setState({ disableBtn: false })
        this.goBack()
      }).catch((err:any) => {
        let { msg } = err
        this.setState({ errorMsg: msg || err, disableBtn: false })
        this.handleBasicModal(1)
      })
    } else {
      // 组织 organize
      values['organize'] = values.organize.join('-')
      axios.request(api.recruitmentAdd, values).then((res:any) => {
        this.$message.success('新增成功！')
        this.setState({ disableBtn: false })
        SysUtil.clearSession('recruitmentInfo')
        this.goBack()
      }).catch((err:any) => {
        let { msg } = err
        this.setState({ errorMsg: msg || err, disableBtn: false })
        this.handleBasicModal(1)
      })
    }
  }

  /** 返回上一级页面 */
  goBack = () => {
    this.props.history.push('/home/recruit/recruitment')
  }

  /** 错误的谭弹框的显示 */
  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  // 工资验证
  validateSalaryOne = (rules:any, value:any, callback:any) => {
    const { getFieldValue, setFields } = this.props.form
    let reg = /^\d+$/
    if (!reg.test(value)) callback(new Error('请输入数字'))
    let val = getFieldValue('highestSalary')
    if (!JudgeUtil.isEmpty(val) && Number(val) < Number(value)) {
      setFields({ highestSalary: { value: val, errors: [new Error('不能小于起始金额')] } })
    }
    callback()
  }

  // 工资验证
  validateSalaryTwo = (rules:any, value:any, callback:any) => {
    const { getFieldValue } = this.props.form
    let reg = /^\d+$/
    if (!reg.test(value)) callback(new Error('请输入数字'))
    let val = getFieldValue('lowestSalary')
    if (Number(val) >= Number(value)) {
      callback(new Error('不能小于起始金额'))
    }
    callback()
  }

  /** 项目改变 查询组织的信息 */
  projectChange = (value:any) => {
    this.props.mobxCommon.getOrganizeAry(value)
    const { setFieldsValue } = this.props.form
    setFieldsValue({
      organize: undefined,
      postName: undefined
    })
    this.setState({ postAry: [] })
  }

  /** 根据组织查询 岗位的信息 */
  organizeChange = (value:any) => {
    const { setFieldsValue } = this.props.form
    this.axios.request(this.api.recruitmentPost, {
      organize: value.join('-')
    }).then(({ data }:any) => {
      setFieldsValue({ postName: undefined })
      this.setState({ postAry: data || [] })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 合同主体改变 */
  subjectChange = (type:string = 'add', value:any) => {
    const { setFieldsValue } = this.props.form
    this.axios.request(this.api.recruitmentGetContractFrom, {
      corporateName: value
    }).then(({ data }:any) => {
      this.clearingFormSum = data
      if (type === 'add') {
        setFieldsValue({ contractType: undefined, clearingForm: undefined })
        this.setState({ contractTypeAry: data || [], clearingFormAry: [] })
      } else {
        this.setState({ contractTypeAry: data || [] })
        const { contractType } = this.state.postInfo
        if (contractType) this.contractTypeChange('edit', contractType)
      }
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 协议改变 */
  contractTypeChange = (type:string = 'add', value:string) => {
    const { setFieldsValue } = this.props.form
    let clearingFormAry = this.clearingFormSum.filter((el:any) => {
      return el.ecType === value
    }).map((el:any) => {
      return el.clearingForm
    })
    if (type === 'add') {
      setFieldsValue({ clearingForm: undefined })
      this.setState({ clearingFormAry: clearingFormAry || [] })
    } else {
      this.setState({ clearingFormAry: clearingFormAry || [] })
      const { clearingForm } = this.state.postInfo
      if (clearingForm) this.clearingFormChange('edit', clearingForm)
    }
  }

  /** 结算方式改变， 改变之后， 填写的薪资改变  */
  clearingFormChange = (type:string = 'add', value:string) => {
    const { setFieldsValue } = this.props.form
    if (type === 'add') {
      if (value !== '月结') {
        setFieldsValue({ lowestSalary: undefined, highestSalary: undefined })
      } else {
        setFieldsValue({ clearingForm: undefined })
      }
    }
    this.setState({ isClearingForm: value !== '月结' })
  }

  /** 地理编码 */
  getAddress = (address:string) => {
    const { axios } = this.axios
    return new Promise((resolve:any, reject:any) => {
      axios.get(`https://restapi.amap.com/v3/geocode/geo?key=66c396efd04c737c46aa3e0442979884&address=${address}`).then((res:any) => {
        const { info, geocodes } = res.data
        if (info === 'OK') {
          if (geocodes.length > 0) {
            const { location } = geocodes[0]
            const [ storeLongitude, storeLatitude ] = location.split(',')
            resolve({ storeLongitude, storeLatitude })
          } else {
            this.getAddress('上海').then(({ storeLongitude, storeLatitude }:any) => {
              resolve({ storeLongitude, storeLatitude })
            }).catch((err:any) => {
              reject(err)
            })
          }
        }
      }).catch((err:any) => {
        reject(err)
      })
    })
  }

  /** 初始化城市 */
  initCity = () => {
    const { prId, postInfo } = this.state
    if (prId && postInfo.province) {
      let ary = []
      if (!JudgeUtil.isEmpty(postInfo.province)) ary.push(postInfo.province)
      if (!JudgeUtil.isEmpty(postInfo.city)) ary.push(postInfo.city)
      if (!JudgeUtil.isEmpty(postInfo.district)) ary.push(postInfo.district)
      return ary
    } else {
      return undefined
    }
  }

  /** 城市 */
  initTese = (value:any) => {
    const { prId } = this.state
    if (prId) {
      return !JudgeUtil.isEmpty(value) ? value.split(',') : []
    } else {
      return !JudgeUtil.isEmpty(value) ? value : []
    }
  }

  /** 初始化城市 */
  initOrganize = (value:any) => {
    const { prId } = this.state
    if (prId) {
      return !JudgeUtil.isEmpty(value) ? value.split('-') : []
    } else {
      return !JudgeUtil.isEmpty(value) ? value : []
    }
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
    const { disableBtn, prId, clearingFormAry, postInfo,
      contractTypeAry, errorMsg, cityAry, postAry, isClearingForm, InterviewAry, visibleModal, spinIcon } = this.state
    const layoutForm = {
      labelCol: { span: 6 },
      wrapperCol: { span: 10 }
    }
    const { clearingForm, contractSubject, contractType,
      highestSalary, lowestSalary, organize, postDescribe,
      postFeature, postName, postRequirement, prType, projectName, recruitNumber,
      salary, workAddress, electronInterviewId
    } = postInfo as PostInfo
    if (prId) getFieldDecorator('prId', { initialValue: Number(prId) })
    // if (prId) getFieldDecorator('organize', { initialValue: organize })
    // if (prId) getFieldDecorator('postName', { initialValue: postName })
    // if (prId) getFieldDecorator('projectName', { initialValue: projectName })
    const { project, subjectData, organizeAry } = this.props.mobxCommon
    if (!prId) getFieldDecorator('projectName', { initialValue: project })
    if (InterviewAry.length > 0 && InterviewAry[0].templateName !== '请选择') {
      InterviewAry.unshift({ electronInterviewId: 'd1000', templateName: '请选择' })
    }
    return (
      <div className='cus-home-content'>
        <Form onSubmit={this.handleSubmit} {...layoutForm}>
          <Row>
            <Col span={12}>
              <Form.Item label='地区'>
                {getFieldDecorator('cityd', {
                  initialValue: this.initCity(),
                  rules: [{ required: true, message: '请选择地区' }]
                })(
                  <Cascader allowClear options={cityAry}
                    fieldNames = {{ label: 'name', value: 'name', children: 'postIntermediateObj' }}
                    placeholder="请选择地区"/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='项目'>
                {prId ? projectName : project}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='岗位类别'>
                {getFieldDecorator('prType', {
                  initialValue: prType,
                  rules: [{ required: true, message: '请选择岗位类别' }]
                })(
                  <Select allowClear placeholder='请选择岗位类别' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                    <Select.Option value='仓储'>仓储</Select.Option>
                    <Select.Option value='物流'>物流</Select.Option>
                    <Select.Option value='零售'>零售</Select.Option>
                    <Select.Option value='餐饮'>餐饮</Select.Option>
                    <Select.Option value='其他'>其他</Select.Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='部门' wrapperCol={{ span: prId ? 18 : 10 }} className='cus-input'>
                {prId ? organize : getFieldDecorator('organize', {
                  initialValue: organize ? this.initOrganize(organize) : undefined,
                  rules: [{ required: true, message: '请选择部门' }]
                })(
                  <Cascader changeOnSelect onChange={this.organizeChange} options={organizeAry}
                    fieldNames={{ label: 'organize', value: 'organize', children: 'next' }}
                    placeholder="请选择部门" />
                )}
                <Icon type='reload' spin={spinIcon} style={{ position: 'absolute', right: -20, top: 2 }} onClick={this.reloadData}></Icon>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='合同主体'>
                {getFieldDecorator('contractSubject', {
                  initialValue: contractSubject,
                  rules: [{ required: true, message: '请选择合同主体' }]
                })(
                  <Select className='cus-select-autowidth' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                    allowClear onChange={this.subjectChange.bind(this, 'add')} placeholder='请选择合同主体'>
                    {subjectData.map((el:string, key:number) => (
                      <Select.Option value={el} key={key}>{el}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='岗位名称'>
                {prId ? postName : getFieldDecorator('postName', {
                  initialValue: postName,
                  rules: [{ required: true, message: '请选择岗位名称' }]
                })(
                  <Select allowClear placeholder='请选择岗位名称' getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
                    {postAry.map((el:any, key:number) => (
                      <Select.Option key={key} value={el}>{el}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='合同类型'>
                {getFieldDecorator('contractType', {
                  initialValue: contractType,
                  rules: [{ required: true, message: '请选择合同类型' }]
                })(
                  <Select allowClear getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                    onChange={this.contractTypeChange.bind(this, 'add')} placeholder="请选择合同类型">
                    {contractTypeAry.map((el:any, key:number) => (
                      <Select.Option key={key} value={el.ecType}>{el.ecType}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='招收人数'>
                {getFieldDecorator('recruitNumber', {
                  initialValue: recruitNumber,
                  rules: [{ required: true, validator: ValidateUtil.validateSalary }],
                  getValueFromEvent: ValidateUtil.getValueFromEventNumber
                })(
                  <Input maxLength={3} allowClear placeholder='请输入招收人数'/>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='结算方式'>
                {getFieldDecorator('clearingForm', {
                  initialValue: clearingForm,
                  rules: [{ required: true, message: '请选择结算方式' }]
                })(
                  <Select allowClear getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                    onChange={this.clearingFormChange.bind(this, 'add')} placeholder='请选择结算方式'>
                    {clearingFormAry.map((el:string, key:number) => (
                      <Select.Option key={key} value={el}>{el}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item wrapperCol={{ span: 18 }} label='岗位特色' className='cus-input'>
                {getFieldDecorator('postFeature', {
                  initialValue: postFeature ? this.initTese(postFeature) : undefined,
                  rules: [{ required: true, message: '请输入岗位特色' }]
                })(
                  <LabelItem />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label={<span>{!isClearingForm && <span className='cus-recru-required'>*</span>}薪资</span>}>
                {isClearingForm ? getFieldDecorator('salary', {
                  initialValue: salary,
                  rules: [{ required: true, validator: ValidateUtil.validateSalary }],
                  getValueFromEvent: ValidateUtil.getValueFromEventNumber
                })(
                  <Input allowClear maxLength={7} placeholder='请输入薪资'/>
                ) : <Row>
                  <Col span={11}>
                    <Form.Item>
                      {getFieldDecorator('lowestSalary', {
                        initialValue: lowestSalary,
                        rules: [{ required: true, validator: this.validateSalaryOne }],
                        getValueFromEvent: ValidateUtil.getValueFromEventNumber
                      })(
                        <Input allowClear maxLength={7} placeholder='薪资'/>
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={2}>～</Col>
                  <Col span={11}>
                    <Form.Item>
                      {getFieldDecorator('highestSalary', {
                        initialValue: highestSalary,
                        rules: [{ required: true, validator: this.validateSalaryTwo }],
                        getValueFromEvent: ValidateUtil.getValueFromEventNumber
                      })(
                        <Input allowClear maxLength={7} placeholder='薪资'/>
                      )}
                    </Form.Item>
                  </Col>
                </Row>}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='岗位要求' wrapperCol={{ span: 18 }} className='cus-input'>
                {getFieldDecorator('postRequirement', {
                  initialValue: postRequirement ? this.initTese(postRequirement) : undefined,
                  rules: [{ required: true, message: '请输入岗位要求' }]
                })(
                  <LabelItem />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='工作地址'>
                {getFieldDecorator('workAddress', {
                  initialValue: workAddress,
                  rules: [{ required: true, message: '请输入工作地址' }],
                  getValueFromEvent: ValidateUtil.getValueFromEventName
                })(
                  <Input allowClear maxLength={30} placeholder='请输入工作地址'/>
                )}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label='电子模板'>
                {getFieldDecorator('electronInterviewId', {
                  initialValue: electronInterviewId,
                  rules: [{ required: false, message: '请输入电子模板' }]
                })(
                  <Select allowClear getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
                    placeholder='请输入电子模板'>
                    {InterviewAry.map((el:any, key:number) => (
                      <Select.Option key={key} value={el.electronInterviewId}>{el.templateName}</Select.Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label='岗位简介' wrapperCol={{ span: 18 }}>
                {getFieldDecorator('postDescribe', {
                  initialValue: postDescribe,
                  rules: [{ required: true, message: '请输入岗位简介' }]
                })(
                  <TextArea maxLength={2000} autosize={{ minRows: 6, maxRows: 10 }} placeholder='请输入岗位简介'></TextArea>
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item className='btn-inline-group' wrapperCol={{ span: 18, offset: 6 }}>
                <Button type='primary' disabled={disableBtn} htmlType='submit'>
                  { JudgeUtil.isEmpty(prId) ? '新增' : '保存'}
                </Button>
                <Button onClick={this.goBack}>取消</Button>
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

export default Form.create<RecruitmentEditOrAddProps>({
  onValuesChange: (props, changedValues, allValues) => {
    const { prId } = props.match.params
    if (!prId) { // 新增的时候才记录保存
      SysUtil.setSessionStorage('recruitmentInfo', allValues)
    }
  }
})(RecruitmentEditOrAdd)
