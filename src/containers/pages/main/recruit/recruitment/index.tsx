/**
 * @description 在招岗位
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Row, Col } from 'antd'
import { BaseProps } from 'typings/global'
import moment from 'moment'
import { inject, observer } from 'mobx-react'
import SearchItem from './components/SearchItem'
import { SysUtil, globalEnum } from '@utils/index'

interface PostPageProps extends BaseProps {
  mobxCommon?:any
}

interface PostPageState {
  // 搜索的条件
  serachParam: any
  errorMsg: string
  visibleModal: boolean
}
@inject('mobxCommon')
@observer
export default class PostPage extends RootComponent<PostPageProps, PostPageState> {
  private serachParamData:any = {}
  // 上架下架的key
  prId:any = -1
  // 上传的时候的状态
  status:number = -1
  // 弹出关闭的key 默认删除： 0
  handleModalKey:number = 0

  constructor (props:PostPageProps) {
    super(props)
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    let tableAry = SysUtil.getSessionStorage('recruitment_table_page') || {}
    let serachParam = {
      projectName: project
    }
    if (tableAry && tableAry.searchParams) {
      serachParam = tableAry.searchParams
      serachParam.projectName = project
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
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    this.setState({
      serachParam: {
        projectName: project,
        ...this.serachParamData
      }
    })
  }

  postAdd = () => {
    this.props.history.push('/home/recruit/recruitment/editoradd')
  }

  postEdit = ({ prId }:any) => {
    this.props.history.push(`/home/recruit/recruitment/editoradd/${prId}`)
  }

  postDeatil = ({ prId }:any) => {
    this.props.history.push(`/home/recruit/recruitment/detail/${prId}`)
  }

  /** 下架之前 */
  postHelpWantedAfter = ({ prId, postStatus }:any) => {
    this.status = postStatus === '上架' ? 1 : 0
    this.prId = prId
    this.setState({ errorMsg: `确认将该岗位${this.status === 0 ? '上架' : '下架'}！` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 设置上下架 */
  postHelpWanted = () => {
    this.axios.request(this.api.recruitmentUpperShelf, {
      prId: this.prId,
      code: this.status
    }).then((res:any) => {
      this.prId = -1
      this.status = -1
      this.loadingTableData()
      this.$message.success(`设置成功！`)
    }).catch((err:any) => {
      let { msg } = err
      this.handleModalKey = 0
      this.handleModal(1)
      this.setState({ errorMsg: msg || err })
    })
  }

  /** 设置急聘取消 之前 */
  postUpperShelAfter = ({ prId, hurri }:any) => {
    this.status = hurri ? 1 : 0
    this.prId = prId
    this.setState({ errorMsg: `确认将其${hurri ? '取消' : '设置'}急聘！` })
    this.handleModalKey = 3
    this.handleModal(1)
  }

  /** 设置急聘取消 */
  postUpperShel = () => {
    this.axios.request(this.api.recruitmentHelpWanted, {
      prId: this.prId,
      code: this.status
    }).then((res:any) => {
      this.prId = -1
      this.status = -1
      this.loadingTableData()
      this.$message.success(`设置成功！`)
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
      this.postHelpWanted()
    } else if (num === 3) { // 取消急聘
      this.postUpperShel()
    }
    this.setState({ visibleModal: num === 1 })
  }

  render () {
    const { serachParam, errorMsg, visibleModal } = this.state
    const columnData = [
      { title: '岗位名称', dataIndex: 'postName', key: 'postName' },
      { title: '隶属架构', dataIndex: 'organize', key: 'organize' },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text:string) => {
          let time = moment(text).format('YYYY-MM-DD HH:mm')
          return (<span>{time}</span>)
        }
      },
      {
        title: '创建人',
        dataIndex: 'userName',
        key: 'userName',
        render: (text:string) => {
          return text ? <span>{text}</span> : '- - -'
        }
      },
      { title: '招聘人数', dataIndex: 'recruitNumber', key: 'recruitNumber' },
      { title: '简历量', dataIndex: 'resumeNumber', key: 'resumeNumber' },
      { title: '浏览量', dataIndex: 'visitNumber', key: 'visitNumber' },
      {
        title: '佣金金额',
        dataIndex: 'brokerage',
        key: 'brokerage',
        render: (text:string) => {
          //  style={{ color: '#FF4A14', fontSize: '18px' }}
          return <span>{text ? <span>￥<span>{text}</span></span> : '---'}</span>
        }
      },
      {
        title: '操作',
        key: 'tags',
        width: 200,
        render: (text:string, record:any) => {
          const { postStatus, hurri } = record
          return (
            <div className="btn-inline-group">
              {postStatus === '上架' && <span className={hurri ? 'cus-lable-waring' : 'cus-lable-info'} onClick={this.postUpperShelAfter.bind(this, record)}>{hurri ? '取消急聘' : '设为急聘'}</span>}
              {postStatus !== '上架' && <span className='cus-span-gray' >设为急聘</span>}
              <span className={postStatus === '上架' ? 'cus-lable-error' : 'cus-lable-info'} onClick={this.postHelpWantedAfter.bind(this, record)}>{postStatus === '上架' ? '下架' : '上架'}</span>
              <span className='cus-lable-info' onClick={this.postDeatil.bind(this, record)}>查看</span>
              {postStatus === '下架' ? <span className='cus-lable-info' onClick={this.postEdit.bind(this, record)}>编辑</span>
                : <span className='cus-span-gray'>编辑</span>}
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
          rowKey="prId"
          sessionPageKey='recruitment_table_page'
          URL={this.api.recruitmentQuery}
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
