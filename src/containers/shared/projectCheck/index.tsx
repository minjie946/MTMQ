/**
 * @author minjie
 * @createTime 2019/09/24
 * @description 多选组织
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import './index.styl'

const pyAry = [
  { title: '上嘉', value: 'sj' },
  { title: '盒马', value: 'hm' },
  { title: '物美', value: 'wm' }
]

/** 对项目的拼接字段进行解析 */
export const returnStr = (str:string):string => {
  let strAry:Array<string> = str ? str.split('_') : []
  let ary:Array<string> = []
  strAry.forEach((els:string) => {
    let a = pyAry.find((el) => el.value === els)
    if (a) ary.push(a.title)
  })
  return ary.join('|')
}

interface ProjectCheckProps {
  onChange?: Function
  value?: string
}

interface ProjectCheckState {
  data: Array<string>
}

export default class ProjectCheck extends RootComponent<ProjectCheckProps, ProjectCheckState> {
  constructor (props:ProjectCheckProps) {
    super(props)
    this.state = {
      data: ['sj']
    }
  }

  componentDidUpdate (prevProps:any, prevState:any) {
    if (this.props.value !== prevProps.value) {
      let str = this.props.value || ''
      this.setState({
        data: str.split('_') || ['sj']
      })
    }
  }

  /** 点击项目选择 */
  spanClick = (e:any) => {
    const { classList } = e.target
    let { data } = this.state
    let val = e.target.getAttribute('data-val')
    if (classList.contains('active')) {
      classList.remove('active')
      classList.add('btn')
      data.splice(data.indexOf(val), 1)
    } else {
      classList.remove('btn')
      classList.add('active')
      data.push(val)
    }
    this.setState({ data }, () => {
      const { onChange } = this.props
      if (onChange) onChange(data.join('_'))
    })
  }

  render () {
    const { data } = this.state
    return (
      <span className='project-container'>
        {pyAry.map((el:any, key:number) => (
          <span className={data.indexOf(el.value) >= 0 ? 'active' : 'btn'} key={key} data-val={el.value} onClick={this.spanClick}>{el.title}</span>
        ))}
      </span>
    )
  }
}
