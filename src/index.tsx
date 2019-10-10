/**
 * @author minjie
 * @createTime 2019/09/27
 * @description react 主页
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import * as RenderDom from 'react-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import '@assets/style/common.styl'
import '../statics/jsencrypt.min'

import Login from '@pages/login/Login'

configure({ enforceActions: 'observed' })

let configProvider = {
  csp: {
    nonce: new Date().getTime().toString()
  },
  locale: zhCN
}

RenderDom.render(
  <Provider>
    <ConfigProvider {...configProvider} >
      <Login/>
    </ConfigProvider>
  </Provider>,
  document.getElementById('app')
)
