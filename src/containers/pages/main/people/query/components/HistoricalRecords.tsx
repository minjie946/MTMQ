/**
 * @description 已入职人员-电子合同历史记录
 * @author minjie
 * @createTime 2019/08/20
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, BasicModal } from '@components/index'
import { Modal, Table, Row, Button } from 'antd'
import moment from 'moment'

interface HistoricalRecordsProps {
  visible: boolean
  onCancel?: Function
  userId?: number
  name?: string
}

interface HistoricalRecordsState {
  visibleConstract: boolean
  contractUrl: string
  dataSource: any
  visibleModal: boolean
  errorMsg: string
}

export default class HistoricalRecords extends RootComponent<HistoricalRecordsProps, HistoricalRecordsState> {
  constructor (props:HistoricalRecordsProps) {
    super(props)
    this.state = {
      visibleConstract: false,
      contractUrl: '',
      dataSource: [],
      visibleModal: false,
      errorMsg: ''
    }
  }

  componentDidMount () {
    let { userId } = this.props
    if (userId) {
      this.getListData(userId)
    }
  }

  componentDidUpdate (prevProps:any) {
    let { userId } = this.props
    if (userId && userId !== prevProps.userId) {
      this.getListData(userId)
    }
  }

  getListData = (userId: number) => {
    this.axios.request(this.api.queryHistory, {
      userId: Number(userId),
      page: 1,
      pageSize: 20
    }).then((res:any) => {
      const { data } = res.data
      this.setState({ dataSource: data })
    }).catch((err:any) => {
      this.setState({ errorMsg: err.msg || err })
      this.handleBasicModal(1)
    })
  }

  /** 当前窗口的 开关 */
  handleModel = () => {
    const { onCancel } = this.props
    if (onCancel) onCancel(false)
  }

  /** 查看对应的电子合同 */
  visibleConstractModal = (visibleConstract: boolean, nfuId: number = 0) => {
    if (visibleConstract) {
      this.axios.request(this.api.queryHistoryConstroct, {
        nfuId: nfuId
      }).then((res:any) => {
        this.setState({ contractUrl: res.data })
      }).catch((err:any) => {
        this.setState({ errorMsg: err.msg || err, visibleConstract: false })
        this.handleBasicModal(1)
      })
    }
    this.setState({ visibleConstract })
  }

  handleBasicModal = (num:number) => {
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const { visible, name } = this.props
    const { visibleConstract, contractUrl, dataSource, visibleModal, errorMsg } = this.state
    const propsModal = {
      title: name ? name + '电子合同历史记录' : '电子合同历史记录',
      centered: true,
      onCancel: this.handleModel,
      footer: false,
      visible: visible
    }
    const columnData = [
      { title: '系统操作人', width: 120, dataIndex: 'createUserName', key: 'createUserName' },
      { title: '联系方式', width: 120, dataIndex: 'createUserPhone', key: 'createUserPhone' },
      { title: '类型', width: 120, dataIndex: 'contractType', key: 'contractType' },
      { title: '合同主体', dataIndex: 'contractSubject', key: 'contractSubject' },
      { title: '状态', dataIndex: 'signState', key: 'signState' },
      {
        title: '签署时间',
        dataIndex: 'userSignTime',
        key: 'userSignTime',
        render: (text:string, record: any) => {
          const { companySignTime, userSignTime } = record
          if (companySignTime) {
            return moment(companySignTime).format('YYYY-MM-DD HH:mm')
          } else if (userSignTime) {
            return moment(userSignTime).format('YYYY-MM-DD HH:mm')
          } else {
            return '---'
          }
        }
      },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          const { nfuId } = record
          return (
            <div className="span-link">
              {nfuId && <span onClick={this.visibleConstractModal.bind(this, true, nfuId)}>查看</span>}
            </div>
          )
        }
      }
    ]
    return (
      <Modal width={1000} {...propsModal}>
        <div style={{ marginBottom: 20 }}>{name}的电子签记录</div>
        <Table columns={columnData} dataSource={dataSource} rowKey='nfuId' pagination={false}>
        </Table>
        <Modal width='80%' visible={visibleConstract} footer={null} onCancel={this.visibleConstractModal.bind(this, false, -1)}>
          <iframe width='90%' height='600px' style={{ margin: '0 5%' }} src={contractUrl} frameBorder="0"></iframe>
        </Modal>
        <BasicModal visible={visibleModal} onCancel={this.handleBasicModal} title="提示">
          <div className="model-error">
            <p>{errorMsg}</p>
          </div>
          <Row className='cus-modal-btn-top'>
            <Button onClick={this.handleBasicModal.bind(this, 0)} type="primary">确认</Button>
          </Row>
        </BasicModal>
      </Modal>
    )
  }
}
