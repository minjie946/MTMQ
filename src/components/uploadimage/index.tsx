/**
 * @author minjie
 * @createTime 2019/04/03
 * @description 简单的一个上传
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'
import RcUpload from 'rc-upload'
import { Icon } from 'antd'
import imgedite from '@assets/images/icon/imgedite.png'
import { JudgeUtil } from '@utils/index'

import './index.styl'

interface UploadImageProps {
  /** 组件的值选中之后，将值传递给父组件 */
  onChange?: Function
  /** 默认的值 */
  value?: any
  /** 图片上传的比列 默认值 { width: 750, height: 332, company: 'px' } */
  proportion: { width: number, height: number, company?: 'px'|'%' }
  /** 回显的时候显示的图片的地址 默认为空 ‘’ */
  imgURLs: string
  /** 组件的宽度 默认值 '375px' */
  width: string | number
  /** 组件的高度 默认值 '166px' */
  height: string | number
  /** 组件允许上传的类型 默认值 '.png,.jpg,.jpeg' */
  accept: string
  /** 组件上传文件的大小 默认值 2 */
  fileSize: number
}

interface UploadImageState {
  data: any
  imgURL: string
}

export default class UploadImage extends RootComponent<UploadImageProps, UploadImageState> {
  constructor (props:any) {
    super(props)
    const { value } = props
    this.state = {
      data: value || {},
      imgURL: ''
    }
  }

  static defaultProps = {
    proportion: { width: 750, height: 332, company: 'px' }, // 对应的比例
    imgURLs: '',
    fileSize: 2,
    accept: '.png,.jpg,.jpeg',
    width: '375px',
    height: '166px'
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  // 将值传递给父级的事件
  triggerChange = (changedValue:any) => {
    const onChange = this.props.onChange
    if (onChange) {
      onChange(changedValue)
    }
  }

  /* 文件上传的 检查 */
  beforeUpload = (file:any, fileList:any) => {
    const { accept, fileSize, proportion: { width, height, company } } = this.props
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
      const render = new FileReader()
      render.readAsDataURL(file)
      render.onload = (e:any) => {
        let image = new Image()
        image.src = e.target.result
        image.onload = () => {
          let isWidth = image.width // 上传轮播图的宽度
          let isHeight = image.height // 上传轮播图的高度
          let whb = isWidth / isHeight // 轮播图宽/高
          if (whb !== (width / height)) {
            let msg = `请上传比例为${width}px : ${height}px的图片`
            if (company === '%') {
              msg = `请上传比例为${width}:${height}的图片`
            }
            this.$message.warning(msg)
          } else {
            resolve(file)
          }
        }
      }
    })
  }

  // 自定义的文件上传, 默认的不传，直接成功
  customRequest = (request:any) => {
    const { file } = request
    request.onSuccess(file)
  }

  /* 文件的移除 */
  remove = () => {
    this.setState({
      data: {}
    })
  }

  onSuccess = (file:any) => {
    const { onChange } = this.props
    const render = new FileReader()
    render.readAsDataURL(file)
    render.onload = (e:any) => {
      this.setState({ imgURL: e.target.result })
      if (onChange) {
        onChange(file)
      }
    }
  }

  render () {
    const { proportion, imgURLs, width, height } = this.props
    const { imgURL } = this.state
    const config = {
      accept: '', // 默认上传的是图片
      multiple: false, // 多选
      onSuccess: this.onSuccess,
      beforeUpload: this.beforeUpload,
      customRequest: this.customRequest
    }
    let proportionS = `${proportion.width}px : ${proportion.height}px`
    if (proportion.company === '%') {
      proportionS = `${proportion.width}:${proportion.height}`
    }
    const whStyle = { width, height }
    return (
      <div>
        <RcUpload {...config} className='banner-upload-btn'>
          {JudgeUtil.isEmpty(imgURL) && JudgeUtil.isEmpty(imgURLs) ? <div style={whStyle} className='banner-upload-content'>
            <p className="banner-upload-drag-icon">
              <Icon type="cloud-upload" />
            </p>
            <p className="banner-upload-text">上传图片不超过2M,尺寸为{proportionS}</p>
            <p className="banner-upload-hint">支持扩展名：.png .jpg</p>
          </div> : <div className='banner-upload-img-content' style={whStyle}>
            <img className='banner-upload-img' src={imgURL || imgURLs} style={whStyle}/>
            <div className='banner-upload-img-one'>
              <img className='banner-upload-updated-img' src={imgedite}/>
              <p className='banner-upload-p'>重新上传</p>
              <p className='banner-upload-p'>图片尺寸为{proportionS}px</p>
            </div>
          </div>}
        </RcUpload>
      </div>
    )
  }
}
