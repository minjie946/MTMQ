/**
 * @description 活动管理
 * @author minjie
 * @createTime 2019/08/26
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, ExcelFileImport, Dowload, BasicModal } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'
import SearchItem from './components/SearchItem'
import { BaseProps } from '@typings/global'
import { JudgeUtil } from '@utils/index'

import AddModal from './components/addModal'

import './style/index.styl'

interface CompanyInformationProps extends BaseProps {
  mobxCommon:any
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
  visibleAdd: boolean
  historyData: any
  visibleBasicModal: boolean
  errorMsg: string
}

export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    this.state = {
      serachParam: {},
      visibleAdd: false,
      historyData: {
        issuedAmountDay: 0, // 今日发放人数
        issuedAmountMonth: 0, // 本月发放人数
        issuedAmountWeek: 0, // 本周发放人数
        issuedFrequencyDay: 0, // 今日发放次数
        issuedFrequencyMonth: 0, // 本月发放次数
        issuedFrequencyWeek: 0, // 本周发放次数
        issuedMoneyDay: 0, // 今日发放金额
        issuedMoneyMonth: 0, // 本月发放金额
        issuedMoneyWeek: 0 // 本周发放金额
      },
      visibleBasicModal: false,
      errorMsg: ''
    }
  }
  private serachParamData:any = {}

  componentDidMount () {
    this.getHistory()
  }

  /** 查询充值历史记录 */
  getHistory = () => {
    this.axios.request(this.api.activityHistory).then((res:any) => {
      this.setState({ historyData: res.data })
    }).catch((err:any) => {
      this.$message.error(err.msg || err)
    })
  }

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingTableData = () => {
    this.getHistory()
    this.setState({ serachParam: this.serachParamData })
  }

  /** 修改为主体 */
  editSubject = ({ projectName }:any) => {
    let { setProject } = this.props.mobxCommon
    setProject(projectName)
  }

  /** 新增 */
  visibleAddModal = (visibleAdd: boolean) => {
    if (!visibleAdd) {
      this.loadingTableData()
    }
    this.setState({ visibleAdd })
  }
  /** 显示错误的信息 */
  visibleHanldeModal = (num: number, errorMsg: string = '') => {
    this.setState({ visibleBasicModal: num === 1, errorMsg })
  }

  render () {
    const { serachParam, visibleAdd, historyData, visibleBasicModal, errorMsg } = this.state
    const columnData = [
      { title: '账号姓名', dataIndex: 'rechargeUserName', key: 'rechargeUserName' },
      { title: '手机号', dataIndex: 'rechargePhoneNumber', key: 'rechargePhoneNumber' },
      {
        title: '发放时间',
        dataIndex: 'rechargeSporderTime',
        key: 'rechargeSporderTime',
        render: (text:string) => moment(text).format('YYYY-MM-DD HH:mm')
      },
      { title: '操作人员', dataIndex: 'createUserName', key: 'createUserName' },
      {
        title: '金额',
        dataIndex: 'rechargeAmount',
        key: 'rechargeAmount',
        render: (text:string) => `¥ ${JudgeUtil.doubleFormat(text, 2)}`
      },
      {
        title: '状态',
        key: 'tags',
        width: 120,
        render: (text:string, record:any) => {
          const { failureReason, rechargeStatus } = record
          if (rechargeStatus !== '充值失败') {
            return rechargeStatus
          } else {
            return (
              <div className="span-link">
                <span onClick={this.visibleHanldeModal.bind(this, 1, failureReason)}>{rechargeStatus}</span>
              </div>
            )
          }
        }
      }
    ]
    return (
      <div style={{ backgroundColor: '#edefef' }}>
        <div className='cus-home-content' style={{ marginBottom: 24, backgroundColor: '#fff' }}>
          <Row>
            <Col span={5} offset={1} className='activity-count-content'>
              <p className='one'><span>本日</span>发放人数</p>
              <p className='two'><span>{historyData.issuedAmountDay}</span>人 <span style={{ marginLeft: 4 }}>({historyData.issuedFrequencyDay}次)</span></p>
              <p className='there'>总金额 ¥ <span> {historyData.issuedMoneyDay} </span> 元</p>
            </Col>
            <Col span={5} className='activity-count-content'>
              <p className='one'><span>本周</span>发放人数</p>
              <p className='two'><span>{historyData.issuedAmountWeek}</span>人 <span style={{ marginLeft: 4 }}>({historyData.issuedFrequencyWeek}次)</span></p>
              <p className='there'>总金额 ¥ <span> {historyData.issuedMoneyWeek} </span> 元</p>
            </Col>
            <Col span={5} className='activity-count-content'>
              <p className='one'><span>本月</span>发放人数</p>
              <p className='two'><span>{historyData.issuedAmountMonth}</span>人 <span style={{ marginLeft: 4 }}>({historyData.issuedFrequencyMonth}次)</span></p>
              <p className='there'>总金额 ¥ <span> {historyData.issuedMoneyMonth} </span> 元</p>
            </Col>
          </Row>
        </div>
        <div className='cus-home-content' style={{ backgroundColor: '#fff' }}>
          <Row>
            <Col><SearchItem getSerachParam={this.getSerachParam}/></Col>
          </Row>
          <Row className="search-btn btn-inline-group">
            <Col span={5}>
              <Button type="primary" onClick={this.loadingTableData}>查询</Button>
              <Button type="primary" onClick={this.loadingTableData}>刷新</Button>
            </Col>
            <Col span={12}>
              <Button type="primary" onClick={this.visibleAddModal.bind(this, true)}>新增</Button>
              <ExcelFileImport flod='userInfo' action={this.api.activityImport}>
                <Button type="primary">excel批量新增</Button>
              </ExcelFileImport>
              <Dowload type="primary" parmsData={{ type: '.xlsx' }}
                action={this.api.activityDowload} fileName="好饭碗-手机充值导入模板">导入模板下载</Dowload>
            </Col>
          </Row>
          <TableItem
            rowSelectionFixed
            rowSelection={false}
            rowKey="rechargeRecordId"
            URL={this.api.activityQuery}
            searchParams={serachParam}
            columns={columnData}
          />
          <AddModal visible={visibleAdd} onCancel={this.visibleAddModal} />
          <BasicModal title='提示' visible={visibleBasicModal} onCancel={this.visibleHanldeModal}>
            <div className="model-error">
              <p>{errorMsg}</p>
            </div>
            <Row className='cus-modal-btn-top'>
              <Button onClick={this.visibleHanldeModal.bind(this, 0, '')} type="primary">确认</Button>
            </Row>
          </BasicModal>
        </div>
      </div>
    )
  }
}
