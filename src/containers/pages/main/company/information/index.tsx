/**
 * @description 公司资讯
 * @author minjie
 * @createTime 2019/06/12
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, TableItem, BasicModal } from '@components/index'
import { Button, Row, Col } from 'antd'
import moment from 'moment'
import { BaseProps } from '@typings/global'
import { SysUtil, globalEnum, JudgeUtil } from '@utils/index'
import SearchItem from './components/SearchItem'
import PreviewModal from './components/PreviewModal'
import { inject, observer } from 'mobx-react'
import { returnStr } from '@shared/index'

interface CompanyInformationProps extends BaseProps {
  mobxCommon?:any
}

interface CompanyInformationState {
  // 搜索的条件
  serachParam: any
  // 错误的消息
  errorMsg: string
  visibleModal: boolean
  visiblePrrview: boolean
  previewHtml: any
  previewtitle: string
}
@inject('mobxCommon')
@observer
export default class CompanyInformation extends RootComponent<CompanyInformationProps, CompanyInformationState> {
  constructor (props:CompanyInformationProps) {
    super(props)
    let project = this.props.mobxCommon.project || SysUtil.getLocalStorage(globalEnum.project)
    let tableAry = SysUtil.getSessionStorage('information_table_page') || {}
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
      visibleModal: false,
      visiblePrrview: false,
      previewHtml: '',
      previewtitle: ''
    }
  }
  // 上架下架的key
  private upperShelfKey:any = undefined
  // 弹出关闭的key 默认删除： 0
  private handleModalKey:number = 0
  // 资讯置顶
  private roofPlacementKey: any = undefined
  // 搜索的条件
  private serachParamData:any = {}

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

  /** 去新增或者编辑的 */
  toAddOrEdit = ({ infoId }:any) => {
    if (infoId && infoId !== -1) { // 编辑
      this.props.history.push(`/home/company/information/edit/${infoId}`)
    } else {
      this.props.history.push(`/home/company/information/add`)
    }
  }

  /** 去详情 */
  toDetail = ({ infoId }:any) => {
    this.props.history.push(`/home/company/information/detail/${infoId}`)
  }

  /** 上/下 架 */
  upperShelf = () => {
    if (this.upperShelfKey) {
      let status = this.upperShelfKey.infoState === 0 ? '下架' : '上架'
      this.axios.request(this.api.informationShelves, {
        infoId: this.upperShelfKey.infoId,
        isDownShelves: this.upperShelfKey.infoState === 0
      }).then((res:any) => {
        this.upperShelfKey = undefined
        this.loadingTableData()
        this.$message.success(`${status}成功！`)
      }).catch((err:any) => {
        let { msg } = err
        this.handleModalKey = 0
        this.handleModal(1)
        this.setState({ errorMsg: msg || err })
      })
    }
  }

  /** 上下架 之前 */
  upperShelfAfter = (record:any) => {
    this.upperShelfKey = record
    let status = record.infoState === 0 ? '下架' : '上架'
    this.setState({ errorMsg: `确认将该资讯${status}！` })
    this.handleModalKey = 2
    this.handleModal(1)
  }

  /** 置顶之前 */
  roofPlacementAfter = (record:any) => {
    this.roofPlacementKey = record
    let status = record.infoIstop === 1 ? '取消置顶' : '置顶'
    this.setState({ errorMsg: `确认将该资讯${status}！` })
    this.handleModalKey = 3
    this.handleModal(1)
  }

  /** 置顶消息 */
  roofPlacement = () => {
    if (this.roofPlacementKey) {
      const { infoIstop, infoId, infoType } = this.roofPlacementKey
      let status = infoIstop === 1 ? '取消置顶' : '置顶'
      this.axios.request(this.api.informationRoofPlacement, {
        infoId,
        infoType: infoType || '--',
        isTop: infoIstop === 0
      }).then((res:any) => {
        this.roofPlacementKey = undefined
        this.loadingTableData()
        this.$message.success(`${status}成功！`)
      }).catch((err:any) => {
        let { msg } = err
        this.handleModalKey = 0
        this.handleModal(1)
        this.setState({ errorMsg: msg || err })
      })
    }
  }

  /** 提示 */
  handleModal = (num:number) => {
    if (num === 2) { // 上架下架
      this.upperShelf()
    }
    if (num === 3) { // 置顶消息
      this.roofPlacement()
    }
    this.setState({ visibleModal: num === 1 })
  }

  /** 富文本的预览 */
  preview = (html:string, previewtitle:string) => {
    if (!JudgeUtil.isEmpty(html)) {
      this.setState({ previewHtml: html, previewtitle })
      this.visiblePrrviewModal(true)
    }
  }

  /** 预览的信息 */
  visiblePrrviewModal = (visiblePrrview: boolean) => {
    this.setState({ visiblePrrview })
  }

  render () {
    const { serachParam, errorMsg, visibleModal, visiblePrrview, previewHtml, previewtitle } = this.state
    const columnData = [
      {
        title: '类别',
        dataIndex: 'infoType',
        key: 'infoType',
        render: (text:string) => {
          return text ? <span>{text}</span> : '---'
        }
      },
      { title: '标题', dataIndex: 'infoTitle', key: 'infoTitle' },
      {
        title: '内容',
        dataIndex: 'infoContent',
        key: 'infoContent',
        render: (text:string, record:any) => {
          return <span className='cus-lable-info' onClick={this.preview.bind(this, text, record.infoTitle)}>点击查看</span>
        }
      },
      { title: '作者', dataIndex: 'infoAuthor', key: 'infoAuthor' },
      {
        title: '创建时间',
        dataIndex: 'infoReleaseTime',
        width: 140,
        key: 'infoReleaseTime',
        render: (text:string) => {
          let time = text ? moment(text).format('YYYY-MM-DD HH:mm') : '---'
          return (<span>{time}</span>)
        }
      },
      {
        title: '所属项目',
        width: 90,
        dataIndex: 'projectName',
        key: 'projectName',
        render: (text:string) => {
          return (<span>{text ? returnStr(text) : '---'}</span>)
        }
      },
      { title: '阅读数', dataIndex: 'infoReadingVolume', key: 'infoReadingVolume' },
      { title: '转发量', dataIndex: 'infoForwardingVolume', key: 'infoForwardingVolume' },
      { title: '点赞量', dataIndex: 'infoPointPraise', key: 'infoPointPraise' },
      { title: '收藏量', dataIndex: 'infoCollectionVolume', key: 'infoCollectionVolume' },
      {
        title: '操作',
        key: 'tags',
        fixed: 'right',
        width: 200,
        render: (text:string, record:any) => {
          const { infoState, infoIstop } = record
          return (
            <div className="btn-inline-group span-link">
              <span onClick={this.toAddOrEdit.bind(this, record)}>编辑</span>
              <span onClick={this.toDetail.bind(this, record)}>查看</span>
              <span onClick={this.upperShelfAfter.bind(this, record)}
                className={infoState === 0 ? 'cus-lable-error' : 'cus-lable-info'}>
                {infoState === 1 ? '上架' : '下架'}
              </span>
              <span onClick={this.roofPlacementAfter.bind(this, record)}
                className={infoIstop === 1 ? 'cus-lable-error' : 'cus-lable-info'}>
                {infoIstop === 0 ? '置顶' : '取消置顶'}
              </span>
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
            <Button type="primary" onClick={this.toAddOrEdit.bind(this, -1)}>新增</Button>
          </Col>
        </Row>
        <TableItem
          rowSelectionFixed
          rowSelection={false}
          rowKey="infoId"
          sessionPageKey='information_table_page'
          URL={this.api.informationQuery}
          searchParams={serachParam}
          scroll={{ x: 1200 }}
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
        <PreviewModal visible={visiblePrrview} title={previewtitle} html={previewHtml} onCancel={this.visiblePrrviewModal}/>
      </div>
    )
  }
}
