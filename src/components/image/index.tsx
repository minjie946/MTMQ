/**
 * @author minjie
 * @createTime 2019/06/25
 * @description 图片预览
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { message, Icon } from 'antd'

import noimg from '@assets/images/icon/noimg.png'

import './index.styl'

interface ImgPreviewProps {
  visible?:boolean
  onClose:Function
  src?:any
  isAlwaysCenterZoom?: boolean
  isAlwaysShowRatioTips?: boolean
}

interface ImgPreviewState {
  screenHeight: number
  screenWidth: number
  ratio: number,
  angle: number
  defaultWidth: any
  defaultHeight: any
  imgSrc: any
  posTop: number
  posLeft: number
  isAlwaysCenterZoom: boolean // 是否总是中心缩放
  isAlwaysShowRatioTips: boolean // 是否总是显示缩放倍数信息,默认点击按钮缩放时才显示
  flags: boolean
  isDraged: boolean
  position: any
  nx: any
  ny: any
  dx: any
  dy: any
  xPum: any
  yPum: any
}

export default class ImgPreview extends RootComponent<ImgPreviewProps, ImgPreviewState> {
  percent:number = 100
  originImgEl:any
  imgEl:any
  constructor (props:ImgPreviewProps) {
    super(props)
    this.state = {
      screenHeight: 0,
      screenWidth: 0,
      ratio: 1,
      angle: 0,
      defaultWidth: 'auto',
      defaultHeight: 'auto',
      imgSrc: '',
      posTop: 0,
      posLeft: 0,
      isAlwaysCenterZoom: false, // 是否总是中心缩放
      isAlwaysShowRatioTips: false, // 是否总是显示缩放倍数信息,默认点击按钮缩放时才显示
      flags: false,
      isDraged: false,
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: ''
    }
  }

  componentDidMount () {
    this.setState({
      screenWidth: window.screen.availWidth,
      screenHeight: window.screen.availHeight,
      ratio: 1,
      angle: 0
    }, () => {
      this.getImgSize()
    })
  }

  componentWillReceiveProps (nextProps:any) {
    this.setState({
      imgSrc: nextProps.src,
      isAlwaysCenterZoom: nextProps.isAlwaysCenterZoom,
      isAlwaysShowRatioTips: nextProps.isAlwaysShowRatioTips
    }, () => {
      this.getImgSize()
    })
  }

  // 获取预览图片的默认宽高和位置
  getImgSize = () => {
    let { ratio, isDraged, isAlwaysCenterZoom } = this.state
    let posTop = 0
    let posLeft = 0
    // 图片原始宽高
    let originWidth = this.originImgEl.width
    let originHeight = this.originImgEl.height
    // 默认最大宽高
    let maxDefaultWidth = 540
    let maxDefaultHeight = 320
    // 默认展示宽高
    let defaultWidth = 0
    let defaultHeight = 0
    if (originWidth > maxDefaultWidth || originHeight > maxDefaultHeight) {
      if (originWidth / originHeight > maxDefaultWidth / maxDefaultHeight) {
        defaultWidth = maxDefaultWidth
        defaultHeight = Math.round(originHeight * (maxDefaultHeight / maxDefaultWidth))
        posTop = (defaultHeight * ratio / 2) * -1
        posLeft = (defaultWidth * ratio / 2) * -1
      } else {
        defaultWidth = Math.round(maxDefaultHeight * (originWidth / originHeight))
        defaultHeight = maxDefaultHeight
        posTop = (defaultHeight * ratio / 2) * -1
        posLeft = (defaultWidth * ratio / 2) * -1
      }
    } else {
      defaultWidth = originWidth
      defaultHeight = originHeight
      posTop = (defaultWidth * ratio / 2) * -1
      posLeft = (defaultHeight * ratio / 2) * -1
    }
    if (isAlwaysCenterZoom) {
      this.setState({
        posTop: posTop,
        posLeft: posLeft,
        defaultWidth: defaultWidth * ratio,
        defaultHeight: defaultHeight * ratio
      })
    } else {
    // 若拖拽改变过位置,则在缩放操作时不改变当前位置
      if (isDraged) {
        this.setState({
          defaultWidth: defaultWidth * ratio,
          defaultHeight: defaultHeight * ratio
        })
      } else {
        this.setState({
          posTop: posTop,
          posLeft: posLeft,
          defaultWidth: defaultWidth * ratio,
          defaultHeight: defaultHeight * ratio
        })
      }
    }
  }

  // 放大
  scaleBig = (type = 'click') => {
    let { ratio, isAlwaysShowRatioTips } = this.state
    ratio += 0.15
    this.percent += 15
    this.setState({
      ratio: ratio
    }, () => {
      this.getImgSize()
    })
    // if (isAlwaysShowRatioTips) {
    //   message.info(`缩放比例:${this.percent}%`, 0.2)
    // } else {
    //   if (type === 'click') {
    //     message.info(`缩放比例:${this.percent}%`, 0.2)
    //   }
    // }
  }

  // 缩小
  scaleSmall = (type = 'click') => {
    let { ratio, isAlwaysShowRatioTips } = this.state
    ratio -= 0.15
    if (ratio <= 0.1) {
      ratio = 0.1
    }
    if (this.percent - 15 > 0) {
      this.percent -= 15
    }
    this.setState({
      ratio: ratio
    }, () => {
      this.getImgSize()
    })
    // if (isAlwaysShowRatioTips) {
    //   message.info(`缩放比例:${this.percent}%`, 0.2)
    // } else {
    //   if (type === 'click') {
    //     message.info(`缩放比例:${this.percent}%`, 0.2)
    //   }
    // }
  }

  // 滚轮缩放
  wheelScale = (e:any) => {
    e.preventDefault()
    if (e.deltaY > 0) {
      this.scaleBig('wheel')
    } else {
      this.scaleSmall('wheel')
    }
  }

  // 旋转
  retate = () => {
    let { angle } = this.state
    angle += 90
    this.setState({
      angle: angle
    })
  }

  // 按下获取当前数据
  mouseDown = (event:any) => {
    let touch
    if (event.touches) {
      touch = event.touches[0]
    } else {
      touch = event
    }
    let position = {
      x: touch.clientX,
      y: touch.clientY
    }
    this.setState({
      flags: true,
      position: position,
      dx: this.imgEl.offsetLeft,
      dy: this.imgEl.offsetTop
    })
  }

  mouseMove = (event:any) => {
    let { dx, dy, position, flags } = this.state
    if (flags) {
      event.preventDefault()
      let touch
      if (event.touches) {
        touch = event.touches[0]
      } else {
        touch = event
      }
      this.setState({
        isDraged: true,
        nx: touch.clientX - position.x,
        ny: touch.clientY - position.y,
        xPum: dx + touch.clientX - position.x,
        yPum: dy + touch.clientY - position.y
      }, () => {
        this.imgEl.style.left = this.state.xPum + 'px'
        this.imgEl.style.top = this.state.yPum + 'px'
      })
    }
  }

  mouseUp = () => {
    this.setState({
      flags: false
    })
  }

  mouseOut = () => {
    this.setState({
      flags: false
    })
  }

  // 关闭预览
  closePreview = () => {
    let { onClose } = this.props
    this.setState({
      ratio: 1,
      angle: 0,
      defaultWidth: 'auto',
      defaultHeight: 'auto',
      imgSrc: '',
      posTop: 0,
      posLeft: 0,
      flags: false,
      isDraged: false,
      position: {
        x: 0,
        y: 0
      },
      nx: '',
      ny: '',
      dx: '',
      dy: '',
      xPum: '',
      yPum: ''
    }, () => {
      this.getImgSize()
      this.percent = 100
      onClose(0, noimg)
    })
  }

  imgError = (e:any) => {
    let img = e.target
    img.src = noimg
    img.alt = '加载失败'
  }

  render () {
    let { screenWidth, screenHeight, posLeft, posTop, angle, imgSrc } = this.state
    let { visible } = this.props
    return (
      <div className={'preview-wrapper' + (visible ? ' show' : ' hide')} style={{ width: screenWidth, height: screenHeight }}>
        <Icon type='close-circle' className='icon-icon-colse' onClick={this.closePreview}/>
        <div className='img-container'>
          <img className='image'
            width={this.state.defaultWidth}
            height={this.state.defaultHeight}
            onWheel={this.wheelScale}
            style={{ transform: `rotate(${angle}deg)`, top: posTop, left: posLeft }}
            onMouseDown={this.mouseDown}
            onMouseMove={this.mouseMove}
            onMouseUp={this.mouseUp}
            onMouseOut={this.mouseOut}
            draggable={false}
            onError={this.imgError}
            src={imgSrc} ref={(img) => { this.imgEl = img }} alt="预览图片"/>
        </div>
        <img className='origin-image' src={imgSrc} ref={(originImg) => { this.originImgEl = originImg }} alt="预览图片"/>
        <div className='operate-con'>
          <div onClick={() => { this.scaleBig('click') }} className='operate-btn'>
            <Icon type='zoom-in' className='icon'/>
            <span>放大</span>
          </div>
          <div onClick={() => { this.scaleSmall('click') }} className='operate-btn'>
            <Icon type='zoom-out' className='icon'/>
            <span>缩小</span>
          </div>
          <div onClick={this.retate} className='operate-btn'>
            <Icon type='redo' className='icon'/>
            <span>旋转</span>
          </div>
          <div onClick={this.closePreview} className='operate-btn'>
            <Icon type='close-circle' className='icon'/>
            <span>关闭</span>
          </div>
        </div>
      </div>
    )
  }
}
