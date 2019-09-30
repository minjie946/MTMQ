/**
 * @author minjie
 * @createTime 2019/05/14
 * @description excel 文件导入
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RcUpload from 'rc-upload'
import { RootComponent } from '@components/index'
import { Modal, Row, Col, Button, Progress } from 'antd'
import { JudgeUtil, SysUtil, globalEnum, OSSUtil } from '@utils/index'
import dowloadWaring from '@assets/images/state/dowload-waring.svg'
import moment from 'moment'
import './index.styl'

interface ExcelFileImportProps {
  // 上传的字段文件名
  name?: string
  // 上传的文件夹存储的地方
  flod?: string
  // 上传的路径
  action?: any
  // 样式类名
  className?: string
  // 行内样式
  style?: object
  // 是否多选
  multiple?:boolean
  // 允许上传的类型
  accept?:string
  // 限制的大小
  size?:number
  // 上传的时候的参数
  params?: any
  /** 导入成功之后的函数 */
  onSuccess?: Function
  /** 导入失败之后的回掉 */
  onCancel?: Function
}

interface ExcelFileImportState {
  // 允许上传到的类型
  accept: string
  // 允许上传的大小
  fileSize: number
  // 上传文件的名字
  filename: string
  // 错误的值
  errmsg: string
  // 错误下载的URL
  errurl: string
  // 弹出框的值
  visible:boolean
  // 弹出框的值
  visibleProgress:boolean
  // 上传的进度条
  progressPercent: number
}

export default class ExcelFileImport extends RootComponent<ExcelFileImportProps, ExcelFileImportState> {
  constructor (props:any) {
    super(props)
    const { accept, size, name } = this.props
    this.state = {
      accept: accept || '.xlsx,.xls',
      fileSize: size || 2,
      filename: name || 'file',
      errmsg: '本次导入结果：成功导入X条数据，X条出错，请 下载出错数据的excel文件(含出错原因)，重新修 改后再次导入。',
      errurl: '',
      visible: false,
      visibleProgress: false,
      progressPercent: 0
    }
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  onSuccess = (res: any, file: any) => {
    // this.setState({ visibleProgress: false, progressPercent: 0 })
    const { onSuccess, onCancel } = this.props
    let { data, msg } = res
    if (data && typeof data === 'number') {
      let a = setInterval(() => {
        this.getTaskId(data, a)
      }, 1500)
    } else if (data && typeof data.errorUrl === 'string') {
      const { errorUrl } = data
      if (errorUrl) {
        this.setState({ errurl: errorUrl, errmsg: res.msg })
        this.hanldModal(1)
      } else {
        if (onSuccess) onSuccess()
        this.$message.success('导入成功！')
      }
      this.setState({ visibleProgress: false, progressPercent: 0 })
    } else {
      this.error(msg || '导入出错！')
      if (onCancel) onCancel()
      this.setState({ visibleProgress: false, progressPercent: 0 })
    }
  }

  onError = (err:any) => {
    let { msg, data } = err
    if (JudgeUtil.isEmpty(data) && msg) {
      this.error(msg)
    } else {
      this.error(msg || err)
    }
    this.setState({ visibleProgress: false, progressPercent: 0 })
  }

  /* 文件上传的 检查 */
  beforeUpload = (file:any, fileList:any) => {
    const { accept, fileSize } = this.state
    const { size, name } = file
    let a = '文件上传出错'
    return new Promise((resolve, reject) => {
      // 对文件的信息进行 类型判断
      let index = name.lastIndexOf('.')
      let typeArry = accept.split(',')
      let suffer = (name as string).substring(index, name.length)
      if (typeArry.indexOf(suffer) < 0) {
        a = '请上传正确的文件'
        this.$message.error(a)
        reject(a)
      }
      if ((size / 1024 / 1024) > fileSize) { // 对文件进行 大小判断
        a = `上传文件的大小不能超过${fileSize}M`
        this.$message.warning(a)
        reject(a)
      }
      resolve(file)
    })
  }

  /* 自定义的文件上传, 默认的不传，直接成功 */
  customRequest = (request:any) => {
    const { action, flod } = this.props
    let { file, filename, fileSize, data, onProgress, onSuccess, onError } = request
    let time = moment(new Date()).format('YYYY-MM-DD')
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    OSSUtil.uploadFileStream(file, `file/excel/${flod ? flod + '/' : ''}${userId}/${time}`).then((res:any) => {
      this.setState({ visibleProgress: true })
      this.axios.request(action, {
        filePath: res.name,
        createUser: userId
      }).then((res:any) => {
        onSuccess(res, file)
      }).catch((err:any) => {
        onError(err)
      })
    }).catch((err:any) => {
      onError(err)
    })
  }

  /** 下载数据 */
  dowloadFile = (url:string) => {
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    document.body.appendChild(link)
    link.click()
    this.hanldModal(0)
    this.$message.success('下载成功!')
  }

  /** 弹框的显示 1: ok  0: out */
  hanldModal = (num:number) => {
    this.setState({ visible: num === 1 })
  }

  /**
   * 上传的进度的获取
   */
  getTaskId = async (taskId: number, a:any) => {
    const { onSuccess, onCancel } = this.props
    await this.axios.request(this.api.getTaskInfo, {
      taskId
    }).then((res:any) => {
      //  任务ID 系统 创建人 导入文件路径 错误文件路径 总数 完成数量 状态【进行中-已完成-已关闭】 创建时间
      const { taskId, system, userId, importFilePath, errorFilePath, total, completeAmount, taskState, createTime } = res.data
      if (taskState === '进行中') {
        let progressPercent = JudgeUtil.doubleFormat((Number(completeAmount) / total * 100), 1)
        this.setState({ progressPercent: Number(progressPercent) })
      } else if (taskState === '已完成') {
        clearInterval(a)
        this.setState({ visibleProgress: false, progressPercent: 0 })
        if (errorFilePath) {
          this.setState({ errurl: errorFilePath, errmsg: `本次导入结果：导入${total}条数据，但是存在错误，请 下载出错数据的excel文件(含出错原因)，重新修 改后再次导入。` })
          this.hanldModal(1)
        } else {
          if (onSuccess) onSuccess()
          this.$message.success('导入成功！')
        }
      } else {
        this.$message.success('导入失败！')
        if (onCancel) onCancel()
        clearInterval(a)
        this.setState({ visibleProgress: false, progressPercent: 0 })
      }
    }).catch((err:any) => {
      clearInterval(a)
      if (onCancel) onCancel()
      this.setState({ visibleProgress: false, progressPercent: 0 })
      this.$message.error('查询导入进度失败！' + (err.msg || err))
    })
  }

  render () {
    const { multiple } = this.props
    const { filename, accept, errmsg, errurl, visible, visibleProgress, progressPercent } = this.state
    const config = {
      name: filename,
      accept: accept, // 默认上传的是图片
      multiple: multiple, // 多选
      onSuccess: this.onSuccess,
      onError: this.onError,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest
    }
    return (
      <div className="upload-file-content">
        <RcUpload {...config}>
          {this.props.children}
        </RcUpload>
        <Modal title="" closable={false} footer={null} visible={visibleProgress}>
          <div className="upload-progress">
            <p>正在导入，请稍等...</p>
            <Progress strokeColor={{
              to: '#24C8EA',
              from: '#2B8FF9'
            }}
            status="active" percent={progressPercent} />
          </div>
        </Modal>
        <Modal visible={visible} width={391}
          title={<p className="cus-modal-msg-title ">提示</p>}
          onCancel={this.hanldModal.bind(this, 0)} footer={null}>
          <Row className="cus-modal-msg-waring">
            <Col span={6}><img src={dowloadWaring}></img></Col>
            <Col span={17} offset={1} className="text-info">{errmsg}</Col>
          </Row>
          <Row className="cus-modal-msg-info">
            <p>出错原因可能为：</p>
            <p>1.数据不完整（必填项为空）；</p>
            <p>2.字段格式不正确（如导入数据中的“项目”为系统内没有的项目名称等）；</p>
            <p>3.与原数据冲突（如导入的员工相关记录在系统中已存在）。</p>
          </Row>
          <Row className="cus-modal-msg-btn">
            <Button type="primary" onClick={this.dowloadFile.bind(this, errurl)}>下载出错数据</Button>
          </Row>
        </Modal>
      </div>
    )
  }
}
