/**
 * @description 公司信息
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import SearchItem from './components/SearchItem'
import { BaseProps } from '@typings/global'

interface CompanyInformationProps extends BaseProps {
  mobxCommon:any
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
}
@inject('mobxCommon')
@observer
export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    this.state = {
      serachParam: {}
    }
  }
  private serachParamData:any = {}

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingTableData = () => {
    this.setState({ serachParam: this.serachParamData })
  }

  /** 修改为主体 */
  editSubject = ({ projectName }:any) => {
    let { setProject } = this.props.mobxCommon
    setProject(projectName)
  }

  /** 去新增 */
  toAdd = () => {
    this.props.history.push('/home/company/add')
  }

  /** 去修改 */
  toEdit = ({ projectId }:any) => {
    this.props.history.push(`/home/company/edit/${projectId}`)
  }

  render () {
    const { serachParam } = this.state
    const { project } = this.props.mobxCommon
    const columnData = [
      { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
      { title: '项目状态', dataIndex: 'status', key: 'status' },
      { title: '联系人', dataIndex: 'connectionUser', key: 'connectionUser' },
      { title: '联系电话', dataIndex: 'phoneNumber', key: 'phoneNumber' },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text:string) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{text ? time : '---'}</span>)
        }
      },
      {
        title: '操作',
        key: 'tags',
        render: (record:any) => {
          const { projectName } = record
          return <div className="btn-inline-group span-link">
            {project !== projectName ? <span onClick={this.editSubject.bind(this, record)}>设为主体</span>
              : <span>当前主体</span>}
            <span onClick={this.toEdit.bind(this, record)}>编辑</span>
          </div>
        }
      }
    ]
    return (
      <div className='cus-home-content'>
        <Row>
          <Col><SearchItem getSerachParam={this.getSerachParam}/></Col>
        </Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingTableData}>查询</Button>
            <Button type="primary" onClick={this.loadingTableData}>刷新</Button>
            <Button type="primary" onClick={this.toAdd}>新增</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="projectId"
          URL={this.api.projectQuery}
          searchParams={serachParam}
          columns={columnData}
        />
      </div>
    )
  }
}
