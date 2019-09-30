/**
 * @description 电子面试
 * @author minjie
 * @createTime 2019/06/19
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Row, Col } from 'antd'
import { BaseProps } from 'typings/global'
import moment from 'moment'

import { SysUtil, globalEnum } from '@utils/index'

import SearchItem from './components/SearchItem'

interface PostPageProps extends BaseProps {
}

interface PostPageState {
  // 搜索的条件
  serachParam: any
  errorMsg:string
  visibleModal: boolean
}

export default class PostPage extends RootComponent<PostPageProps, PostPageState> {
  private serachParamData:any = {}
  // 删除的key
  electronInterviewId:number = -1
  // 上架下架的key
  status:string = ''
  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0

  constructor (props:PostPageProps) {
    super(props)
    let tableAry = SysUtil.getSessionStorage('interview_table_page') || {}
    let serachParam = {}
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      this.serachParamData = serachParam
    }
    this.state = {
      serachParam,
      errorMsg: '',
      visibleModal: false
    }
  }

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingTableData = () => {
    this.setState({ serachParam: this.serachParamData })
  }

  postAdd = () => {
    this.props.history.push('/home/recruit/interview/add')
  }

  postEdit = ({ electronInterviewId }:any) => {
    this.props.history.push(`/home/recruit/interview/edit/${electronInterviewId}`)
  }

  /** 上架之前 */
  interviewUppershelfAfter = ({ electronInterviewId, available }:any) => {
    this.status = available === '上架' ? '下架' : '上架'
    this.electronInterviewId = electronInterviewId
    this.setState({ errorMsg: `确认将该电子模板${this.status}！` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 删除之前 */
  removeAfter = ({ electronInterviewId }:any) => {
    this.electronInterviewId = electronInterviewId
    this.setState({ errorMsg: `确认将该电子模板删除！` })
    this.handleModalKey = 3
    this.handleModal(1)
  }

  /** 上架 */
  interviewUppershelf = () => {
    // let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.interviewUpdate, {
      electronInterviewId: this.electronInterviewId,
      available: this.status
    }).then((res:any) => {
      this.electronInterviewId = -1
      this.loadingTableData()
      this.$message.success(`${this.status}成功！`)
    }).catch((err:any) => {
      let { msg } = err
      this.handleModalKey = 0
      this.handleModal(1)
      this.setState({ errorMsg: msg || err })
    })
  }

  /** 删除 */
  remove = () => {
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    this.axios.request(this.api.interviewRemove, {
      electronInterviewId: this.electronInterviewId,
      userId
    }).then((res:any) => {
      this.electronInterviewId = -1
      this.loadingTableData()
      this.$message.success(`删除成功！`)
    }).catch((err:any) => {
      let { msg } = err
      this.handleModalKey = 0
      this.handleModal(1)
      this.setState({ errorMsg: msg || err })
    })
  }

  /** 删除的提示 */
  handleModal = (num:number) => {
    if (num === 2) { // 上架
      this.interviewUppershelf()
    } else if (num === 3) { // 删除
      this.remove()
    }
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const { serachParam, errorMsg, visibleModal } = this.state
    const columnData = [
      { title: '模板名称', dataIndex: 'templateName', key: 'templateName' },
      {
        title: '创建时间',
        dataIndex: 'creationTime',
        key: 'creationTime',
        render: (text:string, record:any) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{time}</span>)
        }
      },
      { title: '模板状态', dataIndex: 'available', key: 'available' },
      { title: '创建人', dataIndex: 'userName', key: 'userName', render: (text:any) => <span>{text || '---'}</span> },
      {
        title: '操作',
        key: 'tags',
        width: 160,
        render: (record:any) => {
          const { available } = record
          return (
            <div className="btn-inline-group">
              <span className='cus-lable-info' onClick={this.postEdit.bind(this, record)}>编辑</span>
              <span className={available === '上架' ? 'cus-lable-waring' : 'cus-lable-info'} onClick={this.interviewUppershelfAfter.bind(this, record)}>
                {available === '上架' ? '下架' : '上架'}
              </span>
              <span className='cus-lable-error' onClick={this.removeAfter.bind(this, record)}>删除</span>
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
            <Button type="primary" onClick={this.loadingTableData}>查询</Button>
            <Button type="primary" onClick={this.loadingTableData}>刷新</Button>
            <Button type="primary" onClick={this.postAdd}>新增</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="electronInterviewId"
          sessionPageKey='interview_table_page'
          URL={this.api.interviewQuery}
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
