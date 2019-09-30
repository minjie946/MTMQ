/**
 * @description 合伙人
 * @author minjie
 * @createTime 2019/07/5
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, ExcelFileImport, Dowload } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'

import SearchItem from './components/SearchItem'
import AddOrEditModal from './components/AddOrEditModal'

interface QueryPageProps {
  history:any
}

interface QueryPageState {
  serachParam:any
  errorMsg: string
  // 新增修改的弹窗的显示
  visible: boolean,
  // 新增修改的弹窗的类型
  postType: 'edit' | 'add'
  // 单条的ID
  ecId: number
}

export default class QueryPage extends RootComponent<QueryPageProps, QueryPageState> {
  // 暂时保存信息
  private serachParam:any = {
    ecName: undefined,
    corporateName: undefined,
    status: ''
  }

  constructor (props:any) {
    super(props)
    this.state = {
      serachParam: {
        ecName: undefined,
        corporateName: undefined,
        status: ''
      },
      errorMsg: '',
      visible: false,
      postType: 'add',
      ecId: -1
    }
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 设置查询的信息 */
  setSerachParam = (serachParam:any) => {
    if (serachParam.status === 'all') {
      serachParam.status = undefined
    }
    this.serachParam = serachParam
  }

  /** 查询信息 */
  loadingData = () => {
    this.setState({ serachParam: this.serachParam })
  }

  /** 新增合伙人 */
  partnerAdd = () => {
    this.setState({ postType: 'add', ecId: -1 })
    this.visibleModal(true)
  }

  /** 新建 */
  visibleModal = (visible: boolean, num?:number) => {
    if (!visible) this.setState({ ecId: -1 })
    if (num === 1) this.loadingData()
    this.setState({ visible })
  }

  render () {
    const { serachParam, visible, postType, ecId } = this.state
    const columnData = [
      { title: '合伙人ID', dataIndex: 'partnerId', key: 'partnerId' },
      { title: '姓名', dataIndex: 'userName', key: 'userName' },
      { title: '手机号', dataIndex: 'phoneNumber', key: 'phoneNumber' },
      { title: '类别', dataIndex: 'partnerType', key: 'partnerType' },
      {
        title: '合伙人级别',
        dataIndex: 'partnerGrade',
        key: 'partnerGrade',
        render: (text:string) => {
          return (<span>{text || '---'}</span>)
        }
      },
      {
        title: '隶属团队',
        dataIndex: 'teamName',
        key: 'teamName',
        render: (text:string) => {
          return (<span>{!text ? '暂无' : text }</span>)
        }
      },
      {
        title: '开户时间',
        dataIndex: 'createTime',
        key: 'createTime',
        sorter: (a:any, b:any) => {
          let at = new Date(a.createTime).getTime()
          let bt = new Date(b.createTime).getTime()
          if (at > bt) {
            return 1
          } else if (at < bt) {
            return -1
          } else {
            return 0
          }
        },
        render: (text:string) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{time}</span>)
        }
      },
      { title: '加入方式', dataIndex: 'joinType', key: 'joinType' }
    ]
    return (
      <div style={{ margin: 19 }}>
        <Row><Col><SearchItem serachParam={serachParam} serachData={this.setSerachParam}></SearchItem></Col></Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            <Button type="primary" onClick={this.loadingData}>刷新</Button>
            <Button type="primary" onClick={this.partnerAdd}>新建</Button>
            <ExcelFileImport action={this.api.partnerImport} flod='partner'>
              <Button type="primary">批量新建导入</Button>
            </ExcelFileImport>
            <Dowload type="primary" parmsData={{ type: '.xlsx' }}
              action={this.api.partnerImportTem} fileName="好饭碗-合伙人导入模板">导入模板下载</Dowload>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="partnerId"
          URL={this.api.partnerQuery}
          searchParams={serachParam}
          columns={columnData}
        />
        <AddOrEditModal visible={visible} ecId={ecId} type={postType} onCancel={this.visibleModal} />
      </div>
    )
  }
}
