/**
 * @description 看板
 * @author minjie
 * @createTime 2019/08/20
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Button, Row, Col, Tabs, DatePicker } from 'antd'
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts'
import { SysUtil, globalEnum, JudgeUtil } from '@utils/index'
import moment from 'moment'
import './index.styl'

const { TabPane } = Tabs
const styles:any = {
  mainTitle: {
    textAlign: 'center',
    fontSize: 18,
    color: '#333',
    display: 'block',
    padding: 10
  }
}

const scale = {
  name: {
    range: [0, 1]
  },
  value: { alias: '金额', formatter: (val:any) => JudgeUtil.doubleFormat(val, 2) + '元' }
}

const scaleDay = {
  name: {
    range: [0, 1],
    tickCount: 10,
    min: 0,
    max: 20
  },
  value: { alias: '金额', formatter: (val:any) => JudgeUtil.doubleFormat(val, 2) + '元' }
}

interface KanbanPageProps {
}

interface KanbanInter {
  name: string | number
  type: string
  value: number
}

interface KanbanPageState {
  visibleModal: boolean
  errorMsg: string
  monthSalary: Array<KanbanInter> // 月工资发放
  monthCashWithdrawal: Array<KanbanInter> // 月提现
  monthSelfRecommendationFee: Array<KanbanInter> // 月自荐费
  monthRecommendationFee: Array<KanbanInter> // 月推荐费（老推荐费）
  monthCommission: Array<KanbanInter> // 月佣金（推荐费）
  monthExtract: Array<KanbanInter> // 月提佣
  DaysCashWithdrawal: Array<KanbanInter> // 日体现
  DaysExtract: Array<KanbanInter> // 日提佣
  DaysVerification: Array<KanbanInter> // 日验证
  datePickerYearMonth: string
  datePickerYearDay: string
  disbaled: boolean
}

export default class KanbanPage extends RootComponent<KanbanPageProps, KanbanPageState> {
  constructor (props:KanbanPageProps) {
    super(props)
    this.state = {
      errorMsg: '',
      visibleModal: false,
      monthSalary: [], // 月工资发放
      monthCashWithdrawal: [], // 月提现
      monthSelfRecommendationFee: [], // 月自荐费
      monthRecommendationFee: [], // 月推荐费（老推荐费）
      monthCommission: [], // 月佣金（推荐费）
      monthExtract: [], // 月提佣
      DaysCashWithdrawal: [], // 日体现
      DaysExtract: [], // 日提佣
      DaysVerification: [], // 日验证
      datePickerYearMonth: moment().format('YYYY'),
      datePickerYearDay: moment().format('YYYY'),
      disbaled: false
    }
  }

  mailType: string | '提现' | '提佣' | '推荐费' = ''
  handleModalKey:number = 0

  componentDidMount () {
    this.initMonth()
    this.initDay()
  }

  /** 获取看板的记录的数据 */
  getDetail = (queryType: '工资发放' | '提现' | '自荐费' | '推荐费' | '佣金' | '提佣' | '验证', timeType: 'day' | 'month', queryYear: string = moment().format('YYYY')) => {
    return this.axios.request(this.api.kanbanGetAlldetail, {
      queryType,
      queryYear,
      timeType
    })
  }

  /** 对看板的数据进行格式化 */
  formatAry = (ary:any, year:string = '2019') => {
    let arys:any = []
    for (let index = 1; index <= 12; index++) {
      let a = ary.filter((el:any) => Number(el.queryTime.substr(4, 6)) === index)
      if (a.length > 0) {
        arys.push({
          name: moment(a[0].queryTime, 'YYYYMM').format('MM月'),
          value: a[0].moneyAmount
        })
      } else {
        arys.push({
          name: moment(index + '', 'MM').format('MM月'),
          value: 0
        })
      }
    }
    return arys
  }

  formatDay = (ary:any, year:string = '2019') => {
    let yearn = Number(year)
    let arys:any = []
    let sumDay = 365
    if ((yearn % 4 === 0 || yearn % 400 === 0) && yearn % 100 !== 0) {
      sumDay += 1
    }
    for (let index = 1; index <= sumDay; index++) {
      let a = ary.filter((el:any) => moment(yearn, 'YYYY').dayOfYear(index).format('YYYYMMDD') === el.queryTime)
      if (a.length > 0) {
        arys.push({
          name: moment(a[0].queryTime, 'YYYYMMDD').format('MM月DD日'),
          value: a[0].moneyAmount
        })
      } else {
        arys.push({
          name: moment(yearn, 'YYYY').dayOfYear(index).format('MM月DD日'),
          value: 0
        })
      }
    }
    return arys
  }

  initMonth = () => {
    // 工资发放, 提现, 自荐费, 推荐费, 佣金, 提佣, 验证
    // day, month
    const { datePickerYearMonth } = this.state
    Promise.all([
      this.getDetail('工资发放', 'month', datePickerYearMonth),
      this.getDetail('提现', 'month', datePickerYearMonth),
      this.getDetail('自荐费', 'month', datePickerYearMonth),
      this.getDetail('推荐费', 'month', datePickerYearMonth),
      this.getDetail('佣金', 'month', datePickerYearMonth),
      this.getDetail('提佣', 'month', datePickerYearMonth)
    ]).then(([salary, cashWithdrawal, selfRecommendationFee, recommendationFee, commission, extract]:any) => {
      this.setState({
        monthSalary: this.formatAry(salary.data),
        monthCashWithdrawal: this.formatAry(cashWithdrawal.data),
        monthSelfRecommendationFee: this.formatAry(selfRecommendationFee.data),
        monthRecommendationFee: this.formatAry(recommendationFee.data),
        monthCommission: this.formatAry(commission.data),
        monthExtract: this.formatAry(extract.data)
      })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /** 初始化 天数的 */
  initDay = () => {
    const { datePickerYearDay } = this.state
    Promise.all([
      this.getDetail('提现', 'day', datePickerYearDay),
      this.getDetail('提佣', 'day', datePickerYearDay),
      this.getDetail('验证', 'day', datePickerYearDay)
    ]).then(([daysCashWithdrawal, daysExtract, daysVerification]:any) => {
      this.setState({
        DaysCashWithdrawal: this.formatDay(daysCashWithdrawal.data),
        DaysExtract: this.formatDay(daysExtract.data),
        DaysVerification: this.formatDay(daysVerification.data)
      })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  /**
   * 下载实名认证的信息
   */
  dowloadFile = () => {
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.kanbanExport, { userId }).then((res:any) => {
      let url = res.data
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
      this.$message.success('下载成功!')
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err })
      this.handleModal(1)
    })
  }

  /** 错误的谭弹框的显示 */
  handleModal = (num:number) => {
    if (num === 2) {
      this.toSendEmail(this.mailType)
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 选择的月份 查询的年 */
  onChangeMonthYear = (value:any) => {
    if (value) {
      this.setState({ datePickerYearMonth: value.format('YYYY') }, () => {
        this.initMonth()
      })
    }
  }

  /** 选择的日 查询的年 */
  onChangeDayYear = (value:any) => {
    if (value) {
      this.setState({ datePickerYearDay: value.format('YYYY') }, () => {
        this.initDay()
      })
    }
  }

  /** 面板切换刷新 */
  onChange = (activeKey: string) => {
    if (activeKey === 'day') {
      this.initDay()
    } else if (activeKey === 'month') {
      this.initMonth()
    }
  }

  /** 审核/驳回之前 */
  toSendEmailAfter = (mailType:string, e:any) => { // 通过审批按钮
    e.preventDefault()
    this.setState({ errorMsg: `确认发送?` })
    this.mailType = mailType
    this.handleModalKey = 2 // 工作及个人信息
    this.handleModal(1)
  }

  /** 上月体现数据 */
  toSendEmail = (mailType: '提现' | '提佣' | '推荐费' | string) => {
    this.setState({ disbaled: true })
    this.axios.request(this.api.kanbanSend, {
      mailType
    }).then((res:any) => {
      this.$message.success(res.msg || '发送成功！')
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err })
      this.handleModal(1)
    }).finally(() => {
      this.handleModalKey = 0
      this.mailType = ''
      this.setState({ disbaled: false })
    })
  }

  render () {
    const { visibleModal, errorMsg, monthSalary, monthCashWithdrawal, monthSelfRecommendationFee,
      monthRecommendationFee, monthCommission, monthExtract, DaysCashWithdrawal, DaysExtract, DaysVerification,
      datePickerYearMonth, datePickerYearDay } = this.state
    return (
      <div className='cus-home-content'>
        <Row className='row-bootom'>
          <Col span={24} className='btn-inline-group'>
            <Button type='primary' onClick={this.dowloadFile}>实名认证信息导出</Button>
            <Button type='primary' onClick={this.toSendEmailAfter.bind(this, '提现')}>上月app提现数据</Button>
            <Button type='primary' onClick={this.toSendEmailAfter.bind(this, '提佣')}>上月小程序提佣数据</Button>
            <Button type='primary' onClick={this.toSendEmailAfter.bind(this, '推荐费')}>推荐费用告知</Button>
          </Col>
        </Row>
        <Tabs defaultActiveKey="day" onChange={this.onChange}>
          <TabPane key="day" tab='日统计'>
            年份：<DatePicker onPanelChange={this.onChangeDayYear} format='YYYY' value={moment(datePickerYearDay)} mode='year' placeholder='选择年份'></DatePicker>
            <Row>
              <Col span={24}>
                <Chart height={400} padding="auto" data={DaysCashWithdrawal} scale={scaleDay} forceFit>
                  <p className='main-title' style={styles.mainTitle}>日提现</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} color='#007AFF' shape='smooth' position="name*value" />
                </Chart>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Chart height={400} padding="auto" data={DaysExtract} scale={scaleDay} forceFit>
                  <p className='main-title' style={styles.mainTitle}>日提佣</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} color='#FAAD13' shape='smooth' position="name*value" />
                </Chart>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Chart height={400} padding="auto" data={DaysVerification} scale={scaleDay} forceFit>
                  <p className='main-title' style={styles.mainTitle}>日验证</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} color='#52C41A' shape='smooth' position="name*value" />
                </Chart>
              </Col>
            </Row>
          </TabPane>
          <TabPane key="month" tab='月统计'>
           年份：<DatePicker onPanelChange={this.onChangeMonthYear} value={moment(datePickerYearMonth)} format='YYYY' mode='year' placeholder='选择年份'></DatePicker>
            <Row>
              <Col span={12}>
                <Chart height={400} padding="auto" data={monthSalary} scale={scale} forceFit>
                  <p className='main-title' style={styles.mainTitle}>月工资发放</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} shape='smooth' position="name*value" />
                  <Geom type="point" position="name*value" size={2} shape='circle'
                    style={{
                      stroke: '#fff',
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </Col>
              <Col span={12}>
                <Chart height={400} padding="auto" data={monthCashWithdrawal} scale={scale} forceFit>
                  <p className='main-title' style={styles.mainTitle}>月提现</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} shape='smooth' position="name*value" />
                  <Geom type="point" position="name*value" size={2} shape='circle'
                    style={{
                      stroke: '#fff',
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Chart height={400} padding="auto" data={monthSelfRecommendationFee} scale={scale} forceFit>
                  <p className='main-title' style={styles.mainTitle}>月自荐费</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} shape='smooth' position="name*value" />
                  <Geom type="point" position="name*value" size={2} shape='circle'
                    style={{
                      stroke: '#fff',
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </Col>
              <Col span={12}>
                <Chart height={400} padding="auto" data={monthRecommendationFee} scale={scale} forceFit>
                  <p className='main-title' style={styles.mainTitle}>月推荐费（老推荐费）</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} shape='smooth' position="name*value" />
                  <Geom type="point" position="name*value" size={2} shape='circle'
                    style={{
                      stroke: '#fff',
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Chart height={400} padding="auto" data={monthCommission} scale={scale} forceFit>
                  <p className='main-title' style={styles.mainTitle}>月佣金（推荐费）</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} shape='smooth' position="name*value" />
                  <Geom type="point" position="name*value" size={2} shape='circle'
                    style={{
                      stroke: '#fff',
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </Col>
              <Col span={12}>
                <Chart height={400} padding="auto" data={monthExtract} scale={scale} forceFit>
                  <p className='main-title' style={styles.mainTitle}>月提佣</p>
                  <Legend />
                  <Axis name="name"/>
                  <Axis name="value"/>
                  <Tooltip />
                  <Geom type="line" size={2} shape='smooth' position="name*value" />
                  <Geom type="point" position="name*value" size={2} shape='circle'
                    style={{
                      stroke: '#fff',
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
        {/** 错误的弹窗 */}
        <BasicModal visible={visibleModal} onCancel={this.handleModal} title="提示">
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
      </div>
    )
  }
}
