/**
 * @author minjie
 * @createTime 2019/06/17
 * @description 人员组织架构组件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Input, Row, Col, Button, Modal, Checkbox } from 'antd'
import { JudgeUtil, SysUtil, globalEnum } from '@utils/index'
import { searchFun, checkOKFun } from './info'
import { inject, observer } from 'mobx-react'

import './index.styl'

interface SharedOrganizationCheckProps {
  mobxCommon?:any
  // 获取数据
  onChange?:Function
  // 禁用多选
  disableMulti?: boolean
  // 是否使用input框展示结果
  input?: boolean
  // 默认的提示语
  placeholder?:string
  // 样式
  className?:string
  // 是否禁用
  disabledType?: boolean
  // 值
  value?:Array<string>
  // 是否清除数据
  clearData?: boolean
  // 是否开启
  visible?: boolean
  onCancel?: Function
  onClear?: Function
}

interface SharedOrganizationCheckState {
  visible: boolean
  // 保存值
  selData: Array<string>
  // 搜索的值
  searchValue: string
  // 保存筛选之后的值
  filterAry: Array<any>
  // 切换到多选的
  changeCheck: boolean
  // 下一步
  changeNext: boolean
  spinIcon: boolean
}

@inject('mobxCommon')
@observer
export default class SharedOrganizationCheck extends RootComponent<SharedOrganizationCheckProps, SharedOrganizationCheckState> {
  constructor (props:SharedOrganizationCheckProps) {
    super(props)
    let value = props.value || []
    const { organizeAry, project, getOrganizeAry } = this.props.mobxCommon
    getOrganizeAry(project)
    this.state = {
      visible: false,
      filterAry: organizeAry,
      selData: value,
      searchValue: '',
      changeCheck: false,
      changeNext: false,
      spinIcon: false
    }
  }
  timeout: any = null

  componentDidUpdate (prevProps:any, prevState:any) {
    if (this.props.value !== prevProps.value) {
      let selData:Array<string> = this.props.value || []
      this.setState({
        selData,
        changeCheck: selData.length > 1
      })
    }
    if (this.props.clearData !== prevProps.clearData && this.props.clearData) {
      this.resetFields()
    }
    if (this.props.visible !== prevProps.visible) {
      this.handalModel(this.props.visible || false)
    }
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    this.setState = (state, callback) => {}
    if (this.timeout) clearTimeout(this.timeout)
  }

  /** 单选 */
  activerItem = (value:any) => {
    let { selData } = this.state
    if (selData.indexOf(value) >= 0) {
      selData = []
    } else {
      selData = [value]
    }
    this.setState({ selData })
  }

  /** 修改信息 */
  itemChange = (value:any, e:any) => {
    let { selData } = this.state
    let index = selData.indexOf(value)
    if (e.target.checked) {
      selData.push(value)
    } else {
      selData.splice(index, 1)
    }
    this.setState({ selData })
  }

  htmlRender = (data:any, keys:string) => {
    let { selData } = this.state
    keys = keys === '' ? keys : keys + '-'
    return data.map((el:any, key:number) => (
      <div key={key} className='cus-item-share cus-item-col'>
        {el.next !== null && el.next.length > 0 ? <div className='cus-item-share cus-item-row'>
          <div className={selData.indexOf(keys + el.organize) >= 0 ? 'item active' : 'item'}
            onClick={this.activerItem.bind(this, keys + el.organize)}>
            {el.organize}
          </div>
          <div className='cus-item-share cus-item-col'>
            {this.htmlRender(el.next, keys + el.organize)}
          </div>
        </div> : <div className={selData.indexOf(keys + el.organize) >= 0 ? 'item active' : 'item'}
          onClick={this.activerItem.bind(this, keys + el.organize)}>
          {el.organize}
        </div>}
      </div>
    ))
  }

  htmlRenderCheck = (data:any, keys:string) => {
    let { selData } = this.state
    keys = keys === '' ? keys : keys + '-'
    return data.map((el:any, key:number) => (
      <div key={key} className='cus-item-share cus-item-col'>
        {el.next !== null && el.next.length > 0 ? <div className='cus-item-share cus-item-row'>
          <div className={selData.indexOf(keys + el.organize) >= 0 ? 'item active' : 'item'}>
            <Checkbox checked={selData.indexOf(keys + el.organize) >= 0} onChange={this.itemChange.bind(this, keys + el.organize)} className='item-check'/>{el.organize}
          </div>
          <div className='cus-item-share cus-item-col'>
            {this.htmlRenderCheck(el.next, keys + el.organize)}
          </div>
        </div> : <div className={selData.indexOf(keys + el.organize) >= 0 ? 'item active' : 'item'}>
          <Checkbox checked={selData.indexOf(keys + el.organize) >= 0} onChange={this.itemChange.bind(this, keys + el.organize)} className='item-check'/>{el.organize}
        </div>}
      </div>
    ))
  }

  /** modal 框的显示 */
  handalModel = (visible:boolean) => {
    this.setState({ visible })
    const { onCancel } = this.props
    if (onCancel && !visible) {
      onCancel(false)
    }
    const { organizeAry, project, getOrganizeAry } = this.props.mobxCommon
    getOrganizeAry(project)
    this.setState({ filterAry: organizeAry || [] })
  }

  /** 搜索的值改变 */
  searchChange = (e:any) => {
    this.setState({ searchValue: e.target.value })
  }

  /** 开始搜索 */
  searchWhere = () => {
    const { searchValue } = this.state
    const { organizeAry } = this.props.mobxCommon
    if (!JudgeUtil.isEmpty(searchValue)) {
      this.setState({ filterAry: searchFun(organizeAry, searchValue) })
    } else {
      this.setState({ filterAry: organizeAry || [] })
    }
  }

  /** 发送数据 */
  confirm = () => {
    const { onChange } = this.props
    const { organizeAry } = this.props.mobxCommon
    // 将值传递给上级
    if (onChange) {
      onChange(this.state.selData)
      this.setState({
        visible: false,
        selData: [],
        filterAry: organizeAry || [],
        searchValue: '',
        changeCheck: false,
        changeNext: false
      })
      this.handalModel(false)
    }
  }

  /** 清空数据 */
  resetFields = () => {
    const { organizeAry } = this.props.mobxCommon
    const { onClear } = this.props
    if (onClear) {
      onClear(false)
    }
    this.setState({
      visible: false,
      filterAry: organizeAry || [],
      searchValue: '',
      changeCheck: false,
      changeNext: false,
      selData: []
    })
  }

  /** 切换成单选还是多选等 */
  changeItem = (changeCheck:boolean) => {
    this.setState({ changeCheck, selData: [] })
  }

  /** 多选下一步 */
  changeNextItem = (changeNext: boolean) => {
    this.searchWhere()
    this.setState({ changeNext })
  }

  /** 刷新组织的数据 */
  reloadData = () => {
    this.props.mobxCommon.setOrganize()
    const { organizeAry } = this.props.mobxCommon
    this.setState({ filterAry: organizeAry || [] })
    this.setState({ spinIcon: true })
    this.timeout = setTimeout(() => {
      this.setState({ spinIcon: false })
    }, 1500)
  }

  render () {
    const { visible, filterAry, selData, searchValue, changeCheck, changeNext, spinIcon } = this.state
    const { disableMulti, input, placeholder, className, disabledType } = this.props
    return (
      <div>
        {input && !disabledType && <div className={className ? `${className} cus-organization-input` : 'cus-organization-input'}>
          {selData.length === 0 && <div onClick={this.handalModel.bind(this, true)} className='cus-input-placeholder'>{placeholder || '请选择隶属架构'}</div>}
          {selData.length === 1 && <div onClick={this.handalModel.bind(this, true)} className='cus-input-placeholder'>
            {selData[0]}
          </div>}
          {selData.length > 1 && <div onClick={this.handalModel.bind(this, true)} className='cus-input-placeholder'>
            {`已选择${selData.length}项`}
          </div>}
        </div>}
        {input && disabledType && <div className={className ? `${className} cus-organization-input cus-disabled` : 'cus-organization-input cus-disabled'}>
          {selData.length === 0 && <div className='cus-input-placeholder'>{placeholder || '请选择隶属架构'}</div>}
          {selData.length === 1 && <div className='cus-input-placeholder'>
            {selData[0]}
          </div>}
          {selData.length > 1 && <div className='cus-input-placeholder'>
            {`已选择${selData.length}项`}
          </div>}
        </div>}
        <Modal width={1120}
          onOk={this.handalModel.bind(this, false)}
          onCancel={this.handalModel.bind(this, false)}
          visible={visible} closable={false} footer={null}>
          <Row>
            <Col span={10}>
              <Row>
                <Col span={14}>
                  <Input value={searchValue} onPressEnter={this.searchWhere} allowClear onChange={this.searchChange.bind(this)} placeholder='请输入你想搜索的关键字'></Input>
                </Col>
                <Col span={4} offset={1}><Button type='primary' onClick={this.searchWhere}>查询</Button></Col>
                <Col span={4}><Button type='primary' loading={spinIcon} icon='reload' onClick={this.reloadData}>刷新组织架构</Button></Col>
              </Row>
            </Col>
            {/* {changeNext ? <Col span={10} offset={3} className='cus-share-btn btn-inline-group'>
              <Button onClick={this.changeNextItem.bind(this, false)}>取消</Button>
              <Button type='primary' ghost onClick={this.changeNextItem.bind(this, false)}>增加</Button>
              <Button type='primary' onClick={this.confirm}>确定</Button>
            </Col> : */}{changeCheck ? <Col span={10} offset={3} className='cus-share-btn btn-inline-group'>
              <Button onClick={this.changeItem.bind(this, false)}>单选</Button>
              {/* <Button onClick={this.handalModel.bind(this, false)}>返回</Button> */}
              <Button type='primary' ghost>
                已选{selData.length}项
              </Button>
              <Button type='primary' onClick={this.confirm}>确定</Button>
              {/* <Button type='primary' onClick={this.changeNextItem.bind(this, true)}>下一步</Button> */}
            </Col> : <Col span={10} offset={3} className='cus-share-btn btn-inline-group'>
              <Button onClick={this.handalModel.bind(this, false)}>返回</Button>
              {!disableMulti && <Button type='primary' ghost onClick={this.changeItem.bind(this, true)}>
                批量选择
              </Button>}
              <Button type='primary' onClick={this.confirm}>确定</Button>
            </Col>}
          </Row>
          <div className='cus-share-organ-container'>
            <div className='cus-share-organ-content'>
              <div className='content-item'><div className='header'>第0层级</div></div>
              <div className='content-item'><div className='header'>第1层级</div></div>
              <div className='content-item'><div className='header'>第2层级</div></div>
              <div className='content-item'><div className='header'>第3层级</div></div>
              <div className='content-item'><div className='header'>第4层级</div></div>
              <div className='content-item'><div className='header'>第5层级</div></div>
            </div>
            {!changeCheck && filterAry && this.htmlRender(filterAry, '')}
            {changeCheck && filterAry && this.htmlRenderCheck(filterAry, '')}
          </div>
        </Modal>
      </div>
    )
  }
}
