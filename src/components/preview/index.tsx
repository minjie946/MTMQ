/**
 * @author minjie
 * @createTime 2019/09/11
 * @description 图片预览
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Icon } from 'antd'
import loginbg from '@assets/images/login/loginbg.png'
import './index.styl'

interface PreviewProps {
  visible?: boolean // 控制是否显示
  onCancel?: Function // 关闭的回调
}

interface PreviewState {
  footertranslateX: number
  footerPrevDispaly: boolean
  footerNextDispaly: boolean
  imgAry: Array<any>
}

export default class Preview extends RootComponent<PreviewProps, PreviewState> {
  constructor (props:PreviewProps) {
    super(props)
    this.state = {
      footertranslateX: 0,
      footerPrevDispaly: true,
      footerNextDispaly: false,
      imgAry: [loginbg, loginbg, loginbg, loginbg, loginbg, loginbg, loginbg, loginbg]
    }
  }

  onCancel = () => {
    const { onCancel } = this.props
    if (onCancel) onCancel()
  }

  /** 切换下面的小图片 */
  footerLabel = (type:'left' | 'right') => {
    let { footertranslateX, footerPrevDispaly, footerNextDispaly, imgAry } = this.state
    if (type === 'left') {
      footertranslateX -= 12
      footerNextDispaly = footertranslateX < 0
    } else if (type === 'right') {
      footertranslateX += 12
      if (footertranslateX >= 0) {
        footerNextDispaly = false
        footertranslateX = 0
      }
    }
    this.setState({ footertranslateX, footerPrevDispaly, footerNextDispaly })
  }

  render () {
    const { visible } = this.props
    const { footertranslateX, footerPrevDispaly, footerNextDispaly, imgAry } = this.state
    let len = imgAry.length
    if (visible) {
      return (
        <div className='preview-container'>
          <div className='preview-header'></div>
          <div className='preview-content'></div>
          <div className='preview-footer'>
            <div className='preview-footer-content'>
              <div className='footer-content-card' style={{ width: len * 200, transform: `translateX(${footertranslateX}%)` }}>
                {imgAry.map((el:any, index:number) => (
                  <div key={index} className='card'><div></div><img src={el}/></div>
                ))}
              </div>
              {footerPrevDispaly && <div className='footer-content-prve' onClick={this.footerLabel.bind(this, 'left')}><span><Icon type='left'/></span></div>}
              {footerNextDispaly && <div className='footer-content-next' onClick={this.footerLabel.bind(this, 'right')}><span><Icon type='right'/></span></div>}
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }
}
