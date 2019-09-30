/**
 * @description 岗位管理
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import SearchItem from './components/SearchItem'
import PostAddOrEdit from './sub/PostAddOrEdit'
import PostDetail from './sub/PostDetail'
import { SysUtil, globalEnum } from '@utils/index'

interface PostPageProps {
  mobxCommon?: any
}

interface PostPageState {
  // 搜索的条件
  serachParam: any
  // 新增修改的弹窗的类型
  postType: 'edit' | 'add'
  // 单条的ID
  pmId: number
  visiblePostAddOrEdit: boolean
  visibleDetail: boolean
}
@inject('mobxCommon')
@observer
export default class PostPage extends RootComponent<PostPageProps, PostPageState> {
  private serachParamData:any = {}

  constructor (props:PostPageProps) {
    super(props)
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    let tableAry = SysUtil.getSessionStorage('post_table_page') || {}
    let serachParam = {
      projectName: project
    }
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      serachParam.projectName = project
      this.serachParamData = serachParam
    }
    this.state = {
      visiblePostAddOrEdit: false,
      visibleDetail: false,
      serachParam,
      postType: 'add',
      pmId: 0
    }
  }

  /** 获取到的搜索的条件 */
  getSerachParam = (serachParam:any) => {
    this.serachParamData = serachParam
  }

  /** 加载数据 */
  loadingTableData = () => {
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    this.setState({
      serachParam: {
        projectName: project,
        ...this.serachParamData
      }
    })
  }

  postAdd = () => {
    this.setState({ postType: 'add', pmId: -1 })
    this.visibleAddModal(true)
  }

  postEdit = ({ pmId }:any) => {
    this.setState({ postType: 'edit', pmId })
    this.visibleAddModal(true)
  }

  postVerify = ({ pmId }:any) => {
    this.setState({ pmId })
    this.visibleDetailModal(true)
  }

  /** 新建修改 */
  visibleAddModal = (visiblePostAddOrEdit: boolean) => {
    if (!visiblePostAddOrEdit) {
      this.loadingTableData()
      this.setState({ pmId: -1 })
    }
    this.setState({ visiblePostAddOrEdit })
  }

  /** 审核 */
  visibleDetailModal = (visibleDetail: boolean) => {
    if (!visibleDetail) {
      this.loadingTableData()
      this.setState({ pmId: -1 })
    }
    this.setState({ visibleDetail })
  }

  render () {
    const { serachParam, postType, pmId, visiblePostAddOrEdit, visibleDetail } = this.state
    const columnData = [
      { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
      { title: '隶属架构', dataIndex: 'organize', key: 'organize' },
      {
        title: '创建人',
        dataIndex: 'userName',
        key: 'userName',
        render: (text:string) => {
          return text ? <span>{text}</span> : '- - -'
        }
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text:string) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return text ? <span>{time}</span> : '- - -'
        }
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text:string) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return text ? <span>{time}</span> : '- - -'
        }
      },
      { title: '当前状态', dataIndex: 'status', key: 'status' },
      { title: '招聘人数', dataIndex: 'recruitedTotal', key: 'recruitedTotal' },
      { title: '佣金金额', dataIndex: 'brokerage', key: 'brokerage' },
      {
        title: '系统状态',
        dataIndex: 'systemStatus',
        key: 'systemStatus',
        render: (text:string, record:any) => {
          if (text === '已通过') {
            return <span className='cus-lable-success'>已通过</span>
          } else {
            return <span className='cus-lable-waring'>未审核</span>
          }
        }
      },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 120,
        render: (text:string, record:any) => {
          let { systemStatus } = record
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.postEdit.bind(this, record)}>编辑</span>
              {systemStatus === '未审核' ? <span onClick={this.postVerify.bind(this, record)}>审核</span> : <span className='cus-span-gray'>审核</span>}
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
          rowKey="pmId"
          sessionPageKey='post_table_page'
          URL={this.api.postQuery}
          searchParams={serachParam}
          scroll={{ x: 1200 }}
          columns={columnData}
        />
        <PostDetail pmId={pmId} visible={visibleDetail} onCancel={this.visibleDetailModal}/>
        <PostAddOrEdit pmId={pmId} type={postType} visible={visiblePostAddOrEdit} onCancel={this.visibleAddModal}></PostAddOrEdit>
      </div>
    )
  }
}
