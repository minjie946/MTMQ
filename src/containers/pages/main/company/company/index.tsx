/**
 * @description 公司信息
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col, Popover } from 'antd'
import moment from 'moment'
import { inject, observer } from 'mobx-react'

import { BaseProps } from '@typings/global'
import { SysUtil, globalEnum, ConfigUtil } from '@utils/index'
import SearchItem from './components/SearchItem'
import BankEdit from './bankEdit'
import './style/index.styl'

interface CompanyInformationProps extends BaseProps {
  mobxCommonx?: any
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
  // Model 状态
  bankVisible: boolean
  cId: number
}
@inject('mobxCommon')
@observer
export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    let tableAry = SysUtil.getSessionStorage('company_table_page') || {}
    let serachParam = {
      projectName: project
    }
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      serachParam.projectName = project
      this.serachParamData = serachParam
    }
    this.state = {
      bankVisible: false,
      cId: -1,
      serachParam
    }
  }

  private serachParamData:any = {}

  /** 获取到的搜索的条件 */
  setSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingTableData = () => {
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    this.setState({
      serachParam: {
        projectName: project,
        ...this.serachParamData
      }
    })
  }

  /** 修改信息 */
  editContent = (record:any) => {
    this.props.history.push(`/home/company/company/edit/${record.cId}`)
  }

  /** 新增公司信息 */
  addContent = () => {
    this.props.history.push(`/home/company/company/add`)
  }

  /** 显示修改账号 */
  onBankCancel = (bankVisible:boolean, cId: number = -1) => {
    this.setState({ bankVisible, cId })
  }

  render () {
    const { serachParam, bankVisible, cId } = this.state
    const columnData = [
      { title: '所属项目', width: 86, dataIndex: 'projectName', key: 'projectName' },
      { title: '公司名称', width: 140, dataIndex: 'companyName', key: 'companyName' },
      { title: '法人', width: 80, dataIndex: 'legalPerson', key: 'legalPerson' },
      { title: '联系电话', width: 120, dataIndex: 'phoneNumber', key: 'phoneNumber' },
      { title: '公司规模', width: 120, dataIndex: 'scale', key: 'scale' },
      { title: '公司性质', width: 120, dataIndex: 'nature', key: 'nature' },
      {
        title: '行业类别',
        dataIndex: 'industryCategory',
        key: 'industryCategory',
        width: 140,
        render: (text:string) => {
          return text.length > 10 ? <Popover getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
            placement="topLeft" title={'推送内容'} overlayStyle={{ width: 400 }} content={text}>
            <span>{text.substring(0, 10)}...</span>
          </Popover> : text
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        width: 140,
        key: 'createTime',
        render: (text:string, record:any) => {
          let time = text ? moment(text).format('YYYY-MM-DD HH:mm') : '---'
          return (<span>{time}</span>)
        }
      },
      {
        title: '操作',
        width: 140,
        key: 'tags',
        render: (text:string, record:any) => {
          let userId = SysUtil.getLocalStorage(globalEnum.userID)
          let powerObj = ConfigUtil.powerObj
          let flag = powerObj['H001002003'].indexOf(userId) >= 0
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.editContent.bind(this, record)}>编辑</span>
              {flag && <span onClick={this.onBankCancel.bind(this, true, record.cId)}>修改公司账户</span>}
            </div>
          )
        }
      }
    ]
    return (
      <div className='cus-home-content'>
        <Row>
          <Col><SearchItem serachParam={serachParam} setSerachParam={this.setSerachParam}/></Col>
        </Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingTableData}>查询</Button>
            <Button type="primary" onClick={this.loadingTableData}>刷新</Button>
            <Button type="primary" onClick={this.addContent}>新增</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="cId"
          sessionPageKey='company_table_page'
          URL={this.api.companyQuery}
          searchParams={serachParam}
          columns={columnData}
        />
        <BankEdit visible={bankVisible} cId={cId} onCancel={this.onBankCancel} />
      </div>
    )
  }
}
