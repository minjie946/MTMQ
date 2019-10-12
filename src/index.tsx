/**
 * @author minjie
 * @createTime 2019/09/27
 * @description react 主页
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import * as RenderDom from 'react-dom'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { configure } from 'mobx'
import { Provider } from 'mobx-react'
import Root from '@router/index'
import '@assets/style/common.styl'
import '../statics/jsencrypt.min'

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
      <Root/>
    </ConfigProvider>
  </Provider>,
  document.getElementById('app')
)
