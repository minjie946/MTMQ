/**
 * @author minjie
 * @createTime 2019/10/14
 * @description 404
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { RootComponent } from '@components/index'

interface ErrorPageProps {
}

interface ErrorPageState {
}

export default class ErrorPage extends RootComponent<ErrorPageProps, ErrorPageState> {
  constructor (props:any) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <div>404</div>
    )
  }
}
