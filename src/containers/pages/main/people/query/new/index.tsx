/**
 * @description 人员信息查看
 * @author minjie
 * @createTime 2019/05/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import moment from 'moment'
import { RootComponent, TableItem, ExcelFileImport, Dowload } from '@components/index'
import { Button, Row, Col } from 'antd'

import SearchItem from '../components/SearchItem'
import ModalForm from '../components/ModalForm'
import ModalSignForm from '../components/ModalSignForm'
import UpdatePhone from '../components/UpdatePhone'
import { SysUtil, globalEnum, ConfigUtil } from '@utils/index'

interface PeopleQueryProps {
  history: any
}
interface PeopleQueryState {
  serachParam: any
  createUser: number
  visibleAdd: boolean // 人员的预录入
  visibleSign: boolean // 新建电子签
  visiblePhone: boolean // 修改手机号
}

export default class PeopleQuery extends RootComponent<PeopleQueryProps, PeopleQueryState> {
  // 暂时保存信息
  private serachParam:any = {}

  constructor (props:any) {
    super(props)
    let createUser = SysUtil.getLocalStorage(globalEnum.userID) || 0
    let tableAry = SysUtil.getSessionStorage('query_new_table_page') || {}
    let serachParam = {
      userName: undefined,
      phoneNumber: undefined,
      contractSubject: undefined,
      viewerId: createUser
    }
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      this.serachParam = serachParam
    }
    this.state = {
      visibleAdd: false,
      visibleSign: false,
      visiblePhone: false,
      serachParam: serachParam,
      createUser
    }
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 查看 */
  queryDetail = (userId:any) => {
    this.props.history.push(`/home/people/detail/new/${userId}`)
  }

  /** 审批 */
  reviewShow = (userId:any) => {
    this.props.history.push(`/home/people/review/new/${userId}`)
  }

  /** 电子合同 */
  queryContract = (record:any) => {
    let { downloadContract, electronicContract, userId } = record
    SysUtil.setSessionStorage('contract-url', {
      downloadContract,
      electronicContract
    })
    this.props.history.push(`/home/people/query/contract/${userId}`)
  }

  /** 查询信息 */
  loadingData = () => {
    const { createUser } = this.state
    this.serachParam['viewerId'] = createUser
    this.setState({ serachParam: this.serachParam })
  }

  /** 设置查询的信息的值 */
  setSerachParam = (serachParam:any) => {
    this.serachParam = serachParam
  }

  /** 新建人员 */
  visibleAddModal = (visibleAdd: boolean, num?: number) => {
    if (num === 1) {
      this.loadingData()
    }
    this.setState({ visibleAdd })
  }

  /** 新建电子签 */
  visibleSignModal = (visibleSign: boolean, num?: number) => {
    if (num === 1) {
      this.loadingData()
    }
    this.setState({ visibleSign })
  }

  /** 修改手机号 */
  visiblePhoneModal = (visiblePhone: boolean, num?: number) => {
    if (num === 1) {
      this.loadingData()
    }
    this.setState({ visiblePhone })
  }

  render () {
    const columnData = [
      { title: '编号', width: 100, dataIndex: 'neId', key: 'neId' },
      { title: '预录入姓名', width: 130, dataIndex: 'userName', key: 'userName' },
      { title: '预录入手机', width: 130, dataIndex: 'phoneNumber', key: 'phoneNumber' },
      {
        title: '预录入合同主体',
        dataIndex: 'contractSubject',
        key: 'contractSubject',
        render: (text:string, record:any) => text || '- - -'
      },
      {
        title: '预录入组织',
        dataIndex: 'userOrganize',
        key: 'userOrganize',
        render: (text:string, record:any) => text || '- - -'
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
        render: (text:string, record:any) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{text ? time : '---'}</span>)
        }
      },
      {
        title: '已开通',
        dataIndex: 'openService',
        key: 'openService',
        render: (text:string) => text || '- - -'
      },
      {
        title: '当前状态',
        dataIndex: 'nowState',
        key: 'nowState',
        render: (text:any, record:any) => {
          // 是否需要签署电子签, 是否需要补全信息, 是否需要绑卡, 是否需要审核  true 需要，false 不需要
          const { fddSign, intactInfo, bindCard, audit } = record
          let textAry:Array<string> = []
          if (fddSign) textAry.push('待签署')
          if (intactInfo) textAry.push('待完善')
          if (bindCard) textAry.push('待绑卡')
          if (audit) textAry.push('待审核')
          if (textAry.length < 1) {
            return '---'
          } else {
            return <span className='cus-lable-info'>{textAry.join('/')}</span>
          }
        }
      },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 140,
        render: (text:string, record:any) => {
          const { neId, needExam } = record
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.queryDetail.bind(this, neId)}>查看</span>
              {needExam ? <span onClick={this.reviewShow.bind(this, neId)}>审批</span> : <span className='cus-span-gray'>审批</span>}
            </div>
          )
        }
      }
    ]
    const { serachParam, createUser, visibleAdd, visibleSign, visiblePhone } = this.state
    let powerObj = ConfigUtil.powerObj
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    let flag = powerObj['H003001007'].indexOf(userId) >= 0
    return (
      <div style={{ margin: 19 }}>
        <Row><Col><SearchItem type="new" serachParam={serachParam} setSerachParam={this.setSerachParam}></SearchItem></Col></Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            <Button type="primary" onClick={this.loadingData}>刷新</Button>
            <Button type="primary" onClick={this.visibleAddModal.bind(this, true, 0)}>新建</Button>
            <ExcelFileImport params={{ createUser }} flod='userInfo' action={this.api.queryImport}>
              <Button type="primary">批量新建导入</Button>
            </ExcelFileImport>
            <Dowload type="primary" parmsData={{ type: '.xlsx' }}
              action={this.api.queryExport} fileName="好饭碗-新建入职员工模板">导入模板下载</Dowload>
            <Button type="primary" onClick={this.visibleSignModal.bind(this, true, 0)} style={{ marginLeft: 50 }}>新建电子签</Button>
            <ExcelFileImport params={{ createUser }} flod='electron' action={this.api.electronSignImport}>
              <Button type="primary">批量电子签</Button>
            </ExcelFileImport>
            <Dowload type="primary" parmsData={{ type: '.xlsx' }}
              action={this.api.electronSignTem} fileName="好饭碗-新建电子签模板"
            >电子签模板下载</Dowload>
            {flag && <Button type="primary" onClick={this.visiblePhoneModal.bind(this, true, 0)}>修改用户手机号</Button>}
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="neId"
          sessionPageKey='query_new_table_page'
          URL={this.api.queryNewQuery}
          scroll={{ x: 1200 }}
          searchParams={serachParam}
          columns={columnData}
        />
        {/** 新增人员 */}
        <ModalForm visible={visibleAdd} onCancel={this.visibleAddModal} />
        {/** 新增电子签 */}
        <ModalSignForm visible={visibleSign} onCancel={this.visibleSignModal} />
        <UpdatePhone visible={visiblePhone} onCancel={this.visiblePhoneModal} />
      </div>
    )
  }
}
