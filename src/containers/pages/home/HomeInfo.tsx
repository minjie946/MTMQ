/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 主界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import { RootComponent } from '@components/index'

import center from '@assets/images/home/center.svg'
import welcome from '@assets/images/home/welcome.svg'

import './style/homeinfo.styl'

export default class HomeInfo extends RootComponent {
  render () {
    return (
      <div className='home-info-content'>
        <img className='image-one' src={welcome} />
        <img className='image-two' src={center} />
      </div>
    )
  }
}
