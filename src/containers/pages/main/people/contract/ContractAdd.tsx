// /**
//  * @description 电子合同新增
//  * @author minjie
//  * @createTime 2019/05/14
//  * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
//  */
// import * as React from 'react'
// import { RootComponent, UploadPdf, BasicModal } from '@components/index'
// import { Form, Button, Select, Input, Icon, Row } from 'antd'
// import { FormComponentProps } from 'antd/lib/form'
// import { BaseProps } from 'typings/global'

// import { ValidateUtil, SysUtil, globalEnum, ConfigUtil } from '@utils/index'

// import uploadIcon from '@assets/images/state/upload.png' // 删除
// import './style/add.styl'

// interface ContractAddProps extends FormComponentProps, BaseProps {
// }

// interface ContractAddState {
//   // 甲方的信息
//   corporateAry:Array<string>
//   // 出错的消息
//   errorMsg: string
//   visibleModal: boolean
// }

// class ContractAdd extends RootComponent<ContractAddProps, ContractAddState> {
//   constructor (props:ContractAddProps) {
//     super(props)
//     this.state = {
//       corporateAry: [],
//       errorMsg: '',
//       visibleModal: false
//     }
//   }

//   /** 获取公司的信息 */
//   componentDidMount () {
//     this.getContractCorporateName()
//   }

//   /** 查询公司的信息 */
//   getContractCorporateName () {
//     this.axios.request(this.api.companyGetCompanyName).then((res:any) => {
//       this.setState({ corporateAry: res.data || [] })
//     }).catch((err:any) => {
//       console.log(err)
//     })
//   }

//   /** 提价信息之前 */
//   handleSubmitAfter = (e:any) => {
//     e.preventDefault()
//     this.props.form.validateFieldsAndScroll((err:any, values:any) => {
//       if (!err) {
//         this.handleSubmit(values)
//       }
//     })
//   }

//   /** 提交信息 */
//   handleSubmit = (values:any) => {
//     let formData = new FormData()
//     // 创建对象的信息
//     if (values) {
//       for (const key in values) {
//         formData.append(key, values[key])
//       }
//     }
//     let userId = SysUtil.getLocalStorage(globalEnum.userID)
//     let token = SysUtil.getLocalStorage(globalEnum.token)
//     this.axios.upload({
//       method: 'post',
//       url: this.api.contractAdd.path,
//       data: formData,
//       headers: {
//         token: token || 'sssin', // 存在token 则发送token
//         traceId: SysUtil.traceId() + '_' + (userId || -1),
//         ...ConfigUtil.isHeader()
//       }
//     }).then((res:any) => {
//       const { code, data, msg, message } = res.data
//       if (code === 200) {
//         this.$message.success('新增电子合同成功！')
//         this.goBack()
//       } else {
//         this.setState({ errorMsg: msg || message })
//         this.handleModal(1)
//       }
//     }).catch((err:any) => {
//       this.setState({ errorMsg: err })
//       this.handleModal(1)
//     })
//   }

//   /** 删除的提示 */
//   handleModal = (num:number) => {
//      this.setState({ visibleModal: num === 1 })
//   }

//   /** 返回上一个界面 */
//   goBack = () => {
//     this.props.history.replace('/home/people/contract')
//   }

//   render () {
//     const formItemLayout = { labelCol: { span: 2 }, wrapperCol: { span: 20 } }
//     const { getFieldDecorator } = this.props.form
//     const { corporateAry, errorMsg, visibleModal } = this.state
//     return (
//       <div style={{ margin: 19 }}>
//         <Form {...formItemLayout} onSubmit={this.handleSubmitAfter}>
//           <Form.Item label="名称">
//             {getFieldDecorator('ecName', {
//               rules: [
//                 { required: true, validator: ValidateUtil.validateName }
//               ],
//               getValueFromEvent: ValidateUtil.getValueFromEventName
//             })(<Input type="text" maxLength={30} allowClear className="cus-input-197" placeholder="请输入名称"></Input>)}
//           </Form.Item>
//           <Form.Item label="状态">
//             {getFieldDecorator('status', {
//               initialValue: '下架',
//               rules: [{ required: true, message: '请选择' }]
//             })(
//               <Select className="cus-input-197" placeholder="请选择" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
//                 <Select.Option value="下架">下架</Select.Option>
//                 <Select.Option value="上架">上架</Select.Option>
//               </Select>
//             )}
//           </Form.Item>
//           <Form.Item label="甲方">
//             {getFieldDecorator('corporateName', {
//               rules: [{ required: true, message: '请选择' }]
//             })(
//               <Select className="cus-input-197" placeholder="请选择" getPopupContainer={(triggerNode:any) => triggerNode.parentElement}>
//                 {corporateAry.map((el:any, index:number) => (
//                   <Select.Option key={index} value={el}>{el}</Select.Option>
//                 ))}
//               </Select>
//             )}
//           </Form.Item>
//           <Form.Item label="正文">
//             {getFieldDecorator('file', {
//               rules: [{ required: true, message: '请上传合同文件' }]
//             })(
//               <UploadPdf accept=".pdf" className="cus-form-upload">
//                 <p className="cus-upload-drag-icon">
//                   <Icon component={() => <img src={uploadIcon}/>} />
//                 </p>
//                 <p className="cus-upload-text">点击或将文件拖拽到这里上传</p>
//                 <p className="cus-upload-hint">支持扩展名：.pdf</p>
//               </UploadPdf>
//             )}
//           </Form.Item>
//           <Form.Item wrapperCol={{ span: 4, offset: 2 }} className="btn-inline-group">
//             <Button type="primary" htmlType="submit">保存</Button>
//           </Form.Item>
//         </Form>
//         <BasicModal visible={visibleModal} onCancel={this.handleModal}  title="提示">
//           <div className="model-error">
//             <p>{errorMsg}</p>
//           </div>
//           <Row className='cus-modal-btn-top'><Button onClick={this.handleModal.bind(this, 0)} type="primary">确认</Button></Row>
//         </BasicModal>
//       </div>
//     )
//   }
// }

// export default Form.create<ContractAddProps>()(ContractAdd)
