/**
 * @description 电子合同
 * @author minjie
 * @createTime 2019/05/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Row, Col, Icon } from 'antd'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import SearchItem from './components/SearchItem'
import { Success, Errors } from '@components/icon/BasicIcon'
import { SysUtil, globalEnum } from '@utils/index'

interface QueryPageProps {
  history:any
  mobxCommon?: any
}

interface QueryPageState {
  serachParam:any
  errorMsg: string
  visibleModal: boolean
}

@inject('mobxCommon')
@observer
export default class QueryPage extends RootComponent<QueryPageProps, QueryPageState> {
  // 删除的key
  removeKey:number = 0
  // 上架下架的key
  upperShelfKey:any = undefined
  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0

  // 暂时保存信息
  private serachParam:any = {
    ecName: undefined,
    corporateName: undefined,
    status: '',
    projectName: this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
  }

  constructor (props:any) {
    super(props)
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    let tableAry = SysUtil.getSessionStorage('constract_table_page') || {}
    let serachParam = {
      ecName: undefined,
      corporateName: undefined,
      status: '',
      projectName: project
    }
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      serachParam.projectName = project
      this.serachParam = serachParam
    }
    this.state = {
      serachParam,
      errorMsg: '',
      visibleModal: false
    }
  }

  componentDidMount () {
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /** 新增合同 */
  contractAdd = () => {
    this.props.history.push('/home/people/contract/add')
  }

  /** 查看 */
  queryDetail = (id:any) => {
    this.props.history.push(`/home/people/contract/detail/${id}`)
  }

  /** 设置查询的信息 */
  setSerachParam = (serachParam:any) => {
    this.serachParam = serachParam
  }

  /** 查询信息 */
  loadingData = () => {
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    this.setState({
      serachParam: {
        projectName: project,
        ...this.serachParam
      }
    })
  }

  /** 删除 */
  remove = () => {
    this.axios.request(this.api.contractRemove, {
      ecId: this.removeKey + ''
    }).then((res:any) => {
      this.removeKey = 0
      this.loadingData()
      this.$message.success(`删除成功！`)
    }).catch((err:any) => {
      let { msg } = err
      this.handleModalKey = 0
      this.handleModal(1)
      this.setState({ errorMsg: msg || err })
    })
  }

  /** 删除之前的判断 */
  removeAfter = (id:any) => {
    this.removeKey = id
    this.setState({ errorMsg: '确认删除！' })
    this.handleModalKey = 3
    this.handleModal(1)
  }

  /** 上/下 架 */
  upperShelf = () => {
    if (this.upperShelfKey) {
      let status = this.upperShelfKey.status === '上架' ? '下架' : '上架'
      this.axios.request(this.api.contractStatus, {
        ecId: Number(this.upperShelfKey.ecId),
        status: status
      }).then((res:any) => {
        this.upperShelfKey = undefined
        this.loadingData()
        this.$message.success(`${status}成功！`)
      }).catch((err:any) => {
        let { code, msg } = err
        this.handleModalKey = 0
        this.handleModal(1)
        this.setState({ errorMsg: msg || err })
      })
    }
  }

  /** 上下架 之前 */
  upperShelfAfter = (record:any) => {
    this.upperShelfKey = record
    let status = record.status === '上架' ? '下架' : '上架'
    this.setState({ errorMsg: `确认将该合同${status}！` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 提示 */
  handleModal = (num:number) => {
    if (num === 2) {
      this.upperShelf()
    } else if (num === 3) {
      this.remove()
    }
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const columnData = [
      { title: '合同名称', dataIndex: 'ecName', key: 'ecName' },
      { title: '所属公司', dataIndex: 'corporateName', key: 'corporateName' },
      { title: '合同类型', dataIndex: 'ecType', key: 'ecType' },
      {
        title: '使用状态',
        dataIndex: 'status',
        key: 'status',
        render: (text:string) => {
          if (text === '上架') {
            return <span><Icon component={Success}/><span>{text}</span></span>
          } else {
            return <span><Icon component={Errors}/><span>{text}</span></span>
          }
        }
      },
      {
        title: '创建时间',
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
          return (<span>{time}</span>)
        }
      },
      {
        title: '操作',
        key: 'tags',
        render: (text:string, record:any) => {
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.queryDetail.bind(this, record.ecId)}>查看</span>
              {record.status === '上架' && <span className='cus-lable-error' onClick={this.upperShelfAfter.bind(this, record)}>下架</span>}
              {record.status !== '上架' && <span onClick={this.upperShelfAfter.bind(this, record)}>上架</span>}
              {/* <span onClick={this.removeAfter.bind(this, record.ecId)}>删除</span> */}
            </div>
          )
        }
      }
    ]
    let { serachParam, errorMsg, visibleModal } = this.state
    return (
      <div style={{ margin: 19 }}>
        <Row><Col><SearchItem serachParam={serachParam} serachData={this.setSerachParam}></SearchItem></Col></Row>
        <Row className="search-btn btn-inline-group">
          <Col>
            <Button type="primary" onClick={this.loadingData}>查询</Button>
            {/* <Button type="primary" onClick={this.contractAdd}>新建</Button> */}
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="ecId"
          sessionPageKey='constract_table_page'
          URL={this.api.contractQuery}
          searchParams={serachParam}
          columns={columnData}
        />
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
