/**
 * @description 工资
 * @author minjie
 * @createTime 2019/08/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal, ExcelFileImport, Dowload } from '@components/index'
import { Button, Row, Col, Checkbox, Popover, Modal, Input } from 'antd'
import moment from 'moment'
import { BaseProps } from '@typings/global'
import { JudgeUtil, SysUtil, globalEnum, ConfigUtil } from '@utils/index'
import SearchItem from './components/SearchItem'

import './style/index.styl'

interface CompanyInformationProps extends BaseProps {
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
  errorMsg: any
  // 删除等之后在本界面重新加载
  reLoadingStatus: boolean
  // checked 的状态
  indeterminate: boolean
  checkAll: boolean
  // 选中的Id
  checkedIdList: Array<any>
  // 选中的userId
  checkedUserList: Array<any>
  // 选中的金额
  checkedMoney: number
  //  划账是否显示
  revokeVisible: boolean
  createUser: number
  // 默认选中的
  selectedRowKeys: Array<any>
  // 下载导入模版之前的提示显示
  modalVisible: boolean
  visibleModal: boolean
  // 再次确认金额
  sumMoney: number | undefined
  // 禁止确认的
  disableOk: boolean
}

export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    let createUser = SysUtil.getLocalStorage(globalEnum.userID) || 0
    let tableAry = SysUtil.getSessionStorage('salary_table_page') || {}
    let serachParam = {
      viewAll: true,
      viewerId: createUser,
      operationState: 5300
    }
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      serachParam.viewerId = createUser
      serachParam.viewAll = true
      serachParam.operationState = tableAry.searchParams.operationState || 5300
      this.serachParamData = serachParam
    } else {
      this.serachParamData = serachParam
    }
    let revokeVisible = true
    if (tableAry.searchParams && !JudgeUtil.isEmpty(tableAry.searchParams.operationState)) {
      revokeVisible = tableAry.searchParams.operationState === 5300
    }
    this.state = {
      serachParam,
      errorMsg: '',
      reLoadingStatus: false,
      indeterminate: false,
      checkAll: false,
      modalVisible: false,
      createUser,
      checkedIdList: [],
      checkedUserList: [],
      checkedMoney: 0,
      revokeVisible,
      selectedRowKeys: [],
      visibleModal: false,
      sumMoney: undefined,
      disableOk: false
    }
  }
  private serachParamData:any = {}

  // 删除的key
  removeKey:number = 0
  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0
  // 撤销的信息
  revokeDataKey:any = {}

  // 选中的ID
  private checkedIdList: Array<any> = []
  // 选中的ID
  private checkedUserList: Array<any> = []
  private checkedMoney: number = 0

  componentDidMount () {
    this.getAllMoenyAndUserId()
  }

  /** 查询所有的信息 */
  getAllMoenyAndUserId = () => {
    const { createUser } = this.state
    this.axios.request(this.api.salaryAllIdAndMoney, {
      viewAll: true,
      viewerId: createUser,
      ...this.serachParamData
    }).then((res:any) => {
      const { allId, allMoney, allUserId } = res.data
      this.checkedIdList = allId
      this.checkedUserList = allUserId
      this.checkedMoney = allMoney
    }).catch((err:any) => {
      console.log('查询信息失败：', err.msg || err)
    })
  }

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingData = () => {
    const { createUser } = this.state
    this.getAllMoenyAndUserId()
    this.setState({
      serachParam: {
        viewAll: true,
        viewerId: createUser,
        ...this.serachParamData
      }
    })
  }

  /** 重载之后 */
  onReLoadingStatus = (reLoadingStatus: boolean) => {
    this.setState({ reLoadingStatus })
  }

  /** 删除信息之前 */
  removeDataAfter = ({ userName, billYear, billMonth, id }:any) => {
    this.removeKey = id
    this.setState({ errorMsg: `您确认删除【${userName}】${billYear}年${billMonth}月份的工资信息？` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 删除信息 */
  removeData = () => {
    this.axios.request(this.api.salaryRemove, {
      arrayId: [this.removeKey]
    }).then((res:any) => {
      const { msg } = res
      this.$message.success(msg)
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err })
      this.handleModalKey = 0
      this.handleModal(1)
    }).finally(() => {
      this.onReLoadingStatus(true)
    })
  }

  /** 撤销之前 */
  revokeDataAfter = ({ dataImportTime, userName, billYear, billMonth, id, userId }:any) => {
    this.revokeDataKey = { dataImportTime, id, userId }
    this.setState({ errorMsg: <span style={{ fontSize: '16px' }}>您确认撤销【{userName}】{billYear}年{billMonth}月份的工资信息?<br/><span style={{ color: 'rgb(230, 113, 109)' }}>请谨慎操作！</span></span> })
    this.handleModalKey = 3
    this.handleModal(1)
  }

  /** 撤销 */
  revokeData = () => {
    let { dataImportTime, id, userId } = this.revokeDataKey
    let viewerId = SysUtil.getLocalStorage(globalEnum.userID)
    // 对时间进行判断
    let time:number = new Date((dataImportTime as string)).getTime()
    let nowTime:number = new Date().getTime()
    let num = (nowTime - time) / 1000 / 60 / 60 / 24
    if (parseInt(num + '') < 30) { // 进行撤销
      this.axios.request(this.api.salaryRevoke, {
        id: id,
        userId: userId,
        viewerId
      }).then((res:any) => {
        const { msg } = res
        this.$message.success(msg)
      }).catch((err:any) => {
        this.setState({ errorMsg: err.msg || err })
        this.handleModalKey = 0
        this.handleModal(1)
      }).finally(() => {
        this.onReLoadingStatus(true)
      })
    } else {
      this.$message.warning('已经超过一个月期限无法撤销！！！')
    }
  }

  /** 划账之前 */
  drawAccountsAfter = () => {
    const { checkedIdList, checkedUserList, checkedMoney } = this.state
    if (checkedUserList.length === 0) {
      this.setState({ errorMsg: `请选择您需要划账的用户！` })
      this.handleModalKey = 0
      this.handleModal(1)
    } else {
      if (checkedMoney > 150000) {
        let str = <span style={{ fontSize: '18px' }}>
          {/* <span>
            总金额：<span style={{ color: '#F56C6C' }}>{JudgeUtil.doubleFormat(checkedMoney, 2)}</span> 元
          </span> */}
          总人数：{checkedUserList.length} <br/>
          <span style={{ color: '#F56C6C' }}>总金额超过15万，您是否继续进行转账！</span>
        </span>
        this.setState({ errorMsg: str, disableOk: true })
        this.handleModalKey = 4
        this.handleModal(1)
      } else {
        let str = <span style={{ fontSize: '18px' }}>
          {/* <span>
            总金额：<span style={{ color: '#F56C6C' }}>{JudgeUtil.doubleFormat(checkedMoney, 2)}</span> 元
          </span> */}
          总人数：{checkedUserList.length}
        </span>
        this.setState({ errorMsg: str, disableOk: true })
        this.handleModalKey = 4
        this.handleModal(1)
      }
    }
  }

  /** 划账 */
  drawAccounts = () => {
    const { checkedIdList, checkedUserList } = this.state
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.salaryDrawAccounts, {
      arrayId: checkedIdList,
      arrayUserId: checkedUserList,
      viewerId: userId
    }).then((res:any) => {
      const { msg } = res
      this.$message.success(msg)
      this.loadingData()
    }).catch((err:any) => {
      this.loadingData()
      this.setState({ errorMsg: err.msg || err })
      this.handleModalKey = 0
      this.handleModal(1)
    }).finally(() => {
      this.setState({
        selectedRowKeys: [],
        checkedIdList: [],
        checkedUserList: [],
        checkedMoney: 0,
        indeterminate: false,
        checkAll: false
      })
      this.getAllMoenyAndUserId()
      this.onReLoadingStatus(true)
    })
  }

  /** 提示 */
  handleModal = (num:number) => {
    const { disableOk } = this.state
    if (num === 2) { // 删除
      this.removeData()
    } else if (num === 3) { // 撤销
      this.revokeData()
    } else if (num === 4) { // 划账
      if (disableOk) {
        this.drawAccounts()
      } else {
        this.setState({ disableOk: false })
      }
    }
    if (num === 4) {
      this.setState({ visibleModal: !disableOk, sumMoney: undefined })
    } else {
      this.setState({ visibleModal: num === 1, sumMoney: undefined })
    }
  }

  /** 全选的 */
  onCheckChange = (e:any) => {
    // 查询所有的信息
    if (!e.target.checked) {
      this.setState({
        selectedRowKeys: [],
        checkedIdList: [],
        checkedUserList: [],
        checkedMoney: 0
      })
    } else {
      this.setState({
        selectedRowKeys: this.checkedIdList,
        checkedIdList: this.checkedIdList,
        checkedUserList: this.checkedUserList,
        checkedMoney: this.checkedMoney
      })
    }
    this.setState({
      indeterminate: false,
      checkAll: e.target.checked
    })
  }

  /** 单选 */
  onSelect = (record:any, selected:any, selectedRows:any) => {
    let { checkedIdList, checkedUserList, checkedMoney } = this.state
    if (selected) { // 选中
      if (checkedIdList.indexOf(record.id) < 0) {
        checkedIdList.push(record.id)
        checkedUserList.push(record.userId)
        let moeny:any = Number(checkedMoney) + Number(record.operationAmount)
        if (!isNaN(parseFloat(moeny))) {
          moeny = moeny.toFixed(2)
        }
        checkedMoney = moeny
      }
    } else { // 未选中
      if (checkedIdList.indexOf(record.id) >= 0) {
        let id = checkedIdList.indexOf(record.id)
        let userId = checkedUserList.indexOf(record.userId)
        checkedIdList.splice(id, 1)
        checkedUserList.splice(userId, 1)
        let moeny:any = Number(checkedMoney) - Number(record.operationAmount)
        if (!isNaN(parseFloat(moeny))) {
          moeny = moeny.toFixed(2)
        }
        checkedMoney = moeny
      }
    }
    let indeterminate = false
    let checkAll = false
    if (checkedIdList.length > 0 && checkedIdList.length !== this.checkedIdList.length) {
      indeterminate = true
      checkAll = false
    }
    if (checkedIdList.length > 0 && checkedIdList.length === this.checkedIdList.length) {
      checkAll = true
      indeterminate = false
    }
    this.setState({
      indeterminate,
      checkAll,
      checkedIdList,
      checkedUserList,
      checkedMoney
    })
  }
  /** 全选 */
  onSelectAll = (selected:any, selectedRows:any, changeRows:any) => {
    let { checkedIdList, checkedUserList, checkedMoney } = this.state
    if (selected) { // 全选
      changeRows.forEach((el:any) => {
        if (checkedIdList.indexOf(el.id) < 0) {
          checkedIdList.push(el.id)
          checkedUserList.push(el.userId)
          let moeny:any = Number(checkedMoney) + Number(el.operationAmount)
          if (!isNaN(parseFloat(moeny))) {
            moeny = moeny.toFixed(2)
          }
          checkedMoney = moeny
        }
      })
    } else {
      changeRows.forEach((el:any) => {
        if (checkedIdList.indexOf(el.id) >= 0) {
          let id = checkedIdList.indexOf(el.id)
          let userId = checkedUserList.indexOf(el.userId)
          checkedIdList.splice(id, 1)
          checkedUserList.splice(userId, 1)
          let moeny:any = Number(checkedMoney) - Number(el.operationAmount)
          if (!isNaN(parseFloat(moeny))) {
            moeny = moeny.toFixed(2)
          }
          checkedMoney = moeny
        }
      })
    }
    let indeterminate = false
    let checkAll = false
    if (checkedIdList.length > 0 && checkedIdList.length !== this.checkedIdList.length) {
      indeterminate = true
      checkAll = false
    }
    if (checkedIdList.length > 0 && checkedIdList.length === this.checkedIdList.length) {
      checkAll = true
      indeterminate = false
    }
    this.setState({
      checkedIdList,
      indeterminate,
      checkAll,
      checkedUserList,
      checkedMoney
    })
  }

  /** 对应的状态进行改变 */
  onStateChange = (value:number) => {
    this.loadingData()
    this.setState({ revokeVisible: value === 5300 })
  }

  /** 显示订单的信息 */
  handelModal = (modalVisible:boolean) => {
    this.setState({ modalVisible })
  }

  /** 权限判断 */
  powerAuth = (code:string) => {
    let powerObj = ConfigUtil.powerObj
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    let codeAuth = powerObj[`${code}`]
    return codeAuth && codeAuth.indexOf(userId) >= 0
  }

  /** 输入总金额之后 */
  sumMoneyChange = (e:any) => {
    const { checkedMoney } = this.state
    let sumMoney = e.target.value
    this.setState({ sumMoney, disableOk: Number(checkedMoney) === Number(sumMoney) })
  }

  render () {
    const { serachParam, errorMsg, reLoadingStatus, indeterminate, checkAll, revokeVisible, createUser } = this.state
    const { checkedUserList, checkedMoney, selectedRowKeys, modalVisible, visibleModal, sumMoney } = this.state
    let columnData:any = [
      { title: '编号', dataIndex: 'id', key: 'id' },
      { title: '用户姓名', dataIndex: 'userName', key: 'userName' },
      { title: '年份', dataIndex: 'billYear', key: 'billYear' },
      { title: '月份', dataIndex: 'billMonth', key: 'billMonth' },
      {
        title: '身份证号',
        dataIndex: 'idCard',
        key: 'idCard',
        render: (text:string) => {
          let reg = /^(.{4})(?:\d+)(.{4})$/
          return text // text.replace(reg, '$1******$2')
        }
      },
      { title: '发薪主体', dataIndex: 'sendMoneySubject', key: 'sendMoneySubject' },
      { title: '资金类型', dataIndex: 'operationType', key: 'operationType' },
      {
        title: '操作金额',
        dataIndex: 'operationAmount',
        key: 'operationAmount',
        render: (text:string) => {
          return JudgeUtil.doubleFormat(text, 2) // '******'
        }
      },
      {
        title: '处理状态',
        dataIndex: 'operationState',
        key: 'operationState',
        render: (text:number) => {
          if (text === 5300) {
            return <span>未划账</span>
          } else if (text === 4000) {
            return <span>已撤销</span>
          } else if (text === 7000) {
            return <span>已划账</span>
          }
        }
      },
      { title: '导入人', dataIndex: 'importUserName', key: 'importUserName' },
      { title: '导入时间', dataIndex: 'dataImportTime', key: 'dataImportTime', render: (text:any) => moment(text).format('YYYY-MM-DD HH:mm') }
    ]
    if (serachParam.operationState === 7000) {
      columnData.push({ title: '划账人', dataIndex: 'handleUserName', key: 'handleUserName' })
      columnData.push({ title: '划账时间', dataIndex: 'dataHandleTime', key: 'dataHandleTime', render: (text:any) => moment(text).format('YYYY-MM-DD HH:mm') })
      columnData.push({
        title: '划账结果备注',
        dataIndex: 'firstBillRemarks',
        key: 'firstBillRemarks',
        render: (text:string) => {
          let tx = text && text.length > 10 ? text.substring(0, 10) + '...' : text
          return (<Popover getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
            placement="topLeft" title={'划账结果备注'} overlayStyle={{ width: 400 }} content={text}>
            <span>{tx}</span>
          </Popover>)
        }
      })
    } else if (serachParam.operationState === 4000) {
      columnData.push({ title: '撤销人', dataIndex: 'handleUserName', key: 'handleUserName' })
      columnData.push({ title: '撤销时间', dataIndex: 'dataHandleTime', key: 'dataHandleTime', render: (text:any) => moment(text).format('YYYY-MM-DD HH:mm') })
    }
    columnData.push({
      title: '描述',
      dataIndex: 'billDescribe',
      key: 'billDescribe',
      render: (text:string) => {
        let tx = text.length > 10 ? text.substring(0, 10) + '...' : text
        return (<Popover getPopupContainer={(triggerNode:any) => triggerNode.parentElement}
          placement="topLeft" title={'描述'} overlayStyle={{ width: 400 }} content={text}>
          <span>{tx}</span>
        </Popover>)
      }
    })
    if (serachParam.operationState !== 4000) {
      columnData.push({
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 80,
        render: (record:any) => {
          let { dataImportTime } = record
          // 对时间进行判断
          let time:number = new Date((dataImportTime as string)).getTime()
          let nowTime:number = new Date().getTime()
          let num = (nowTime - time) / 1000 / 60 / 60 / 24
          let revoke = (serachParam.operationState === 7000 && (parseInt(num + '') < 30))
          return (
            <div className="btn-inline-group span-link">
              {serachParam.operationState === 5300 && <span onClick={this.removeDataAfter.bind(this, record)}>删除</span>}
              { revoke && <span onClick={this.revokeDataAfter.bind(this, record)}>撤销</span>}
            </div>
          )
        }
      })
    }
    return (
      <div className='cus-home-content'>
        <Row>
          <Col><SearchItem serachParam={serachParam} onStateChange={this.onStateChange} getSerachParam={this.getSerachParam}/></Col>
        </Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            <Button type="primary" onClick={this.loadingData}>刷新</Button>
            {revokeVisible && this.powerAuth('H004003001') && <Button type="primary" onClick={this.drawAccountsAfter}>划账</Button>}
            {revokeVisible && this.powerAuth('H004003002') && <ExcelFileImport onSuccess={this.loadingData} params={{ createUser }} flod='salary' action={this.api.salaryImport}>
              <Button type="primary">工资导入</Button>
            </ExcelFileImport>}
            {revokeVisible && this.powerAuth('H004003002') && <Button type="primary" onClick={this.handelModal.bind(this, true)}>工资导入模板下载</Button>}
          </Col>
        </Row>
        {revokeVisible && this.powerAuth('H004003001') && <div className='salary-line-row '>
          <Row>
            <Col span={2}>
              <Checkbox indeterminate={indeterminate} checked={checkAll} onChange={this.onCheckChange}>全选</Checkbox>
            </Col>
            <Col span={3}>
              <span>总人数：</span>
              <span className='span'>{checkedUserList.length}</span>
            </Col>
            <Col span={12}>
              <span>总金额：</span>
              <span className='span'>{checkedMoney}</span>
            </Col>
          </Row>
        </div>}
        <TableItem
          rowSelectionFixed
          rowKey="id"
          sessionPageKey='salary_table_page'
          rowSelection={revokeVisible}
          URL={this.api.salaryQuery}
          searchParams={serachParam}
          columns={columnData}
          selectedRowKeys={selectedRowKeys}
          onSelect={this.onSelect}
          onSelectAll={this.onSelectAll}
          scroll={{ x: 1200 }}
          reLoadingStatus={reLoadingStatus}
          onReLoadingStatus={this.onReLoadingStatus}
        />
        <BasicModal visible={visibleModal} onCancel={this.handleModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
            {this.handleModalKey === 4 && <Input style={{ width: 200, margin: '10px 65px 0' }} value={sumMoney} onChange={this.sumMoneyChange} placeholder='请输入划账的金额！'/>}
          </div>
          {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
          </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            <Button onClick={this.handleModal.bind(this, 0)}>取消</Button>
          </Row>}
        </BasicModal>
        <Modal width={400} visible={modalVisible} onCancel={this.handelModal.bind(this, false)} footer={null} title='下载提示'>
          <div className='salary-modal-content'>
            <p>下载导入模板之后,请<span className='span'> 不要 </span>更改【excel单元格格式】</p>
            <p>单条工资,请<span className='span'> 不要 超过15万</span></p>
          </div>
          <div className='btn-inline-group salary-modal-btn'>
            <Dowload onCancel={this.handelModal.bind(this, false)} type="primary" parmsData={{ type: '.xlsx' }}
              action={this.api.salaryExport} fileName="好饭碗-工资导入模板"
            >下载</Dowload>
            <Button onClick={this.handelModal.bind(this, false)}>取消</Button>
          </div>
        </Modal>
      </div>
    )
  }
}
