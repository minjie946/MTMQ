/**
 * @description 工资单
 * @author minjie
 * @createTime 2019/08/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal, ExcelFileImport, Dowload } from '@components/index'
import { Button, Row, Col, Modal } from 'antd'
import moment from 'moment'

import SearchItem from './components/SearchItem'

import { BaseProps } from '@typings/global'
import { JudgeUtil, SysUtil, globalEnum } from '@utils/index'

import PayrollDetail from './detail'
import './style/index.styl'

interface CompanyInformationProps extends BaseProps {
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
  errorMsg: string
  // 详情的弹出框
  payrollVisible: boolean
  detailId: number
  createUser: number
  // 删除等之后在本界面重新加载
  reLoadingStatus: boolean
  // 下载的时候提示
  modalVisible: boolean
  visibleModal: boolean
}

export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    let createUser = SysUtil.getLocalStorage(globalEnum.userID) || 0
    let tableAry = SysUtil.getSessionStorage('payroll_table_page') || {}
    let serachParam = {}
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      this.serachParamData = serachParam
    }
    this.state = {
      serachParam,
      createUser,
      errorMsg: '',
      payrollVisible: false,
      modalVisible: false,
      detailId: -1,
      reLoadingStatus: false,
      visibleModal: false
    }
  }
  private serachParamData:any = {}

  // 删除的key
  removeKey:number = 0
  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingData = () => {
    this.setState({ serachParam: this.serachParamData })
  }

  /** 重载之后 */
  onReLoadingStatus = (reLoadingStatus: boolean) => {
    this.setState({ reLoadingStatus })
  }

  /** 删除信息 */
  removeDataAfter = ({ payrollId, payrollUserName, payrollYears }:any) => {
    this.removeKey = payrollId
    this.setState({ errorMsg: `是否删除【${payrollUserName}】的(${payrollYears})月份的工资单？` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 删除信息 */
  removeMonthAfter = () => {
    const { payrollYears } = this.serachParamData
    if (JudgeUtil.isEmpty(payrollYears)) {
      this.setState({ errorMsg: '请选择需要删除的月份！' })
      this.handleModalKey = 0
      this.handleModal(1)
    } else {
      this.setState({ errorMsg: `是否删除(${payrollYears})月份的工资单？` })
      this.handleModalKey = 3
      this.handleModal(1)
    }
  }

  /** 删除信息(个人) */
  removeData = () => {
    this.axios.request(this.api.payrollRemove, {
      payrollId: this.removeKey
    }).then((res:any) => {
      this.removeKey = 0
      this.loadingData()
      this.$message.success(`删除成功！`)
    }).catch((err:any) => {
      let { msg } = err
      this.handleModalKey = 0
      this.handleModal(1)
      this.setState({ errorMsg: msg || err })
    }).finally(() => {
      this.onReLoadingStatus(true)
    })
  }

  /** 删除月份的工资单信息 */
  removeMonth = () => {
    const { payrollYears } = this.serachParamData
    this.axios.request(this.api.payrollRemoveMonth, {
      payrollYears
    }).then((res:any) => {
      this.removeKey = 0
      this.loadingData()
      this.$message.success(`删除成功！`)
    }).catch((err:any) => {
      let { msg } = err
      this.handleModalKey = 0
      this.handleModal(1)
      this.setState({ errorMsg: msg || err })
    }).finally(() => {
      this.onReLoadingStatus(true)
    })
  }

  /** 删除的提示 */
  handleModal = (num:number) => {
    if (num === 2) {
      this.removeData()
    } else if (num === 3) {
      this.removeMonth()
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 详情的显示框弹出 */
  payrollCancel = (payrollVisible: boolean, detailId:number = -1) => {
    this.setState({ payrollVisible, detailId })
  }

  /** 显示订单的信息 */
  handelModal = (modalVisible:boolean) => {
    this.setState({ modalVisible })
  }

  render () {
    const { serachParam, errorMsg, payrollVisible, detailId, reLoadingStatus, createUser, modalVisible, visibleModal } = this.state
    const columnData = [
      { title: '工资单编号', dataIndex: 'payrollId', key: 'payrollId' },
      { title: '用户姓名', dataIndex: 'payrollUserName', key: 'payrollUserName' },
      { title: '年月', dataIndex: 'payrollYears', key: 'payrollYears' },
      { title: '身份证', dataIndex: 'payrollIdCard', key: 'payrollIdCard' },
      { title: '基本工资', dataIndex: 'payrollBasePay', key: 'payrollBasePay' },
      { title: '实发金额', dataIndex: 'payrollRealHairMoney', key: 'payrollRealHairMoney' },
      { title: '导入人', dataIndex: 'userName', key: 'userName' },
      { title: '导入时间', dataIndex: 'importTime', key: 'importTime', render: (text:any) => moment(text).format('YYYY-MM-DD HH:mm') },
      { title: '备注', dataIndex: 'payrollRemark', key: 'payrollRemark' },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 80,
        render: (record:any) => {
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.payrollCancel.bind(this, true, record.payrollId)}>详情</span>
              <span onClick={this.removeDataAfter.bind(this, record)}>删除</span>
            </div>
          )
        }
      }
    ]
    return (
      <div className='cus-home-content'>
        <Row>
          <Col><SearchItem serachParam={serachParam} getSerachParam={this.getSerachParam}/></Col>
        </Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            <Button type="primary" onClick={this.loadingData}>刷新</Button>
            <Button type="primary" onClick={this.removeMonthAfter}>按月删除</Button>
            <ExcelFileImport params={{ createUser }} flod='payroll' action={this.api.payrollImport}>
              <Button type="primary">工资单导入</Button>
            </ExcelFileImport>
            <Button type="primary" onClick={this.handelModal.bind(this, true)}>工资导入模板下载</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          reLoadingStatus={reLoadingStatus}
          onReLoadingStatus={this.onReLoadingStatus}
          rowKey="payrollId"
          sessionPageKey='payroll_table_page'
          URL={this.api.payrollQuery}
          searchParams={serachParam}
          scroll={{ x: 1200 }}
          columns={columnData}
        />
        <BasicModal visible={visibleModal} onCancel={this.handelModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          {this.handleModalKey === 0 ? <Row className='btn-inline-group'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
          </Row> : <Row className='btn-inline-group cus-modal-btn-top'>
            <Button onClick={this.handleModal.bind(this, this.handleModalKey)} type="primary">确认</Button>
            <Button onClick={this.handleModal.bind(this, 0)}>取消</Button>
          </Row>}
        </BasicModal>
        <PayrollDetail visible={payrollVisible} detailId={detailId} onCancel={this.payrollCancel}/>
        <Modal width={400} visible={modalVisible} onCancel={this.handelModal.bind(this, false)} footer={null} title='下载提示'>
          <div className='payroll-modal-content'>
            <p>下载导入模板之后,请<span className='span'> 不要 </span>更改【excel单元格格式】</p>
          </div>
          <div className='btn-inline-group payroll-modal-btn'>
            <Dowload onCancel={this.handelModal.bind(this, false)} type="primary" parmsData={{ type: '.xlsx' }}
              action={this.api.payrollDowloadTemplte} fileName="好饭碗-工资单导入模板"
            >下载</Dowload>
            <Button onClick={this.handelModal.bind(this, false)}>取消</Button>
          </div>
        </Modal>
      </div>
    )
  }
}
