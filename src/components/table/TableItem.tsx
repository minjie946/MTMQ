/**
 * @author minjie
 * @createTime 2019/05/14
 * @description table 组件
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

import * as React from 'react'
import RootComponent from '@components/root/RootComponent'
import { Table } from 'antd'
import { ComUtil, JudgeUtil, SysUtil } from '@utils/index'

import './TableItem.less'

import { KeyValue } from 'typings/global'
import { PaginationProps } from 'antd/lib/pagination'
type RowSelectionType = 'checkbox' | 'radio'

interface UrlInteface {
  path:string
  type?:string
}

interface TableItemProps {
  URL: UrlInteface,
  rowKey: string | {(record: KeyValue): any},
  columns: any
  searchParams?: object,
  index?: boolean // 是否设置列表序号，默认 true
  scroll?: {
    x?: boolean | number | string
    y?: boolean | number | string
  }
  type?: number // 操作类型 1 - 删除；2 - 导出，默认 1
  rowSelection?: any, // 默认 true
  rowSelectionFixed?: boolean, // 第一列是否设置为左浮动，默认 true
  rowSelectionType?: RowSelectionType, // 设置表格是单选还是多选，默认多选
  filterKey?: string // 新增 key，和 rowKey 一致，但是只能是字符串类型，例如 id，默认 id
  onRow?: boolean // 是否要单击表单任意行选中/取消选中当前行
  getSelectedRow?: (selectedRowKeys: any[], selectedRows: KeyValue[]) => void // 如果需要，该接口用来提供表格选中的数据给父组件
  onSelect?: Function // 删除的选中信息
  onSelectAll?: Function // 删除的选中信息: 全部选中或取消的时候
  bordered?: any
  // 是否需要分页的 true 显示， false 不显示默认的是true
  isPagination?: boolean
  // 离开界面之后是否保存信息
  sessionPageKey?: string
  // 删除之后重新加载数据
  reLoadingStatus?: boolean
  // 删除之后重新调用之后
  onReLoadingStatus?: Function
  // 默认选中的
  selectedRowKeys?: Array<any>
}
interface TableState {
  dataSource: any[]
  pagination: PaginationProps
  selectedRowKeys: any[]
  selectedRows: KeyValue[]
  isPagination?: boolean // 是否需要分页的 true 显示， false 不显示默认的是true
  // table的高度和值判断
  minHeight:number
  loading: boolean
}

// table 的数据 分页的数据

export default class TableItem<T> extends RootComponent<TableItemProps, TableState> {
  static defaultProps = {
    type: 1,
    index: true,
    filterKey: 'id',
    onRow: false,
    rowSelection: true,
    rowSelectionFixed: false,
    rowSelectionType: 'checkbox',
    bordered: false
  }

  constructor (props: TableItemProps) {
    super(props)
    const { isPagination } = this.props
    let minHeight = document.body.clientHeight - 100
    let pageSize = 10
    if (minHeight < 450) {
      minHeight = 450
    } else if (minHeight > 900) {
      pageSize = 20
    }
    this.state = {
      dataSource: [], // 保存前的数据
      minHeight: 450,
      loading: false,
      pagination: {
        current: 1, // 当前的页
        pageSize: pageSize, // 每页显示的条数
        total: 1,
        size: 'middle',
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        showQuickJumper: true,
        onChange: (page: number) => {
          const { pagination } = this.state
          pagination.current = page
          this.setState({ pagination })
          this.loadingTableData()
        },
        onShowSizeChange: (current:any, size:any) => {
          const { pagination } = this.state
          pagination.current = current
          pagination.pageSize = size
          this.setState({ pagination })
          this.loadingTableData()
        },
        showTotal: (total, range) => `共${total}条`
      },
      selectedRowKeys: [],
      selectedRows: [],
      isPagination: isPagination || true
    }
  }

  /**
   * 初始化数据
   */
  componentDidMount () {
    // 监听窗口大小的改变
    window.addEventListener('resize', () => {
      let minHeight = document.body.clientHeight - 100
      const { pagination } = this.state
      let pageSize = 10
      if (minHeight < 450) {
        minHeight = 450
      } else if (minHeight > 900) {
        pageSize = 20
      }
      pagination.pageSize = pageSize
      if (pageSize === 10) {
        this.setState({ minHeight })
      } else {
        this.setState({ pagination, minHeight })
        this.loadingTableData()
      }
    })
    // 保存查询原来的界面
    const { sessionPageKey } = this.props
    if (sessionPageKey) {
      const a = SysUtil.getSessionStorage(sessionPageKey) || {}
      if (a.current && a.pageSize) {
        let { pagination } = this.state
        pagination.current = a.current || 1
        pagination.pageSize = a.pageSize || 10
        let props = {
          index: this.props.index,
          searchParams: a.searchParams || this.props.searchParams,
          URL: this.props.URL
        }
        this.setState({ pagination })
        this.loadingTableData(props)
      } else {
        this.loadingTableData()
      }
    } else {
      this.loadingTableData()
    }
  }

  async componentWillReceiveProps (props: TableItemProps) {
    const { searchParams, sessionPageKey, reLoadingStatus, selectedRowKeys } = props
    if (sessionPageKey) {
      SysUtil.clearSession(sessionPageKey)
    }
    if (!ComUtil.compareDeep(this.props.searchParams, searchParams)) {
      const pagination = this.state.pagination
      pagination.current = 1
      await this.setState({ pagination })
    }
    if (this.props.selectedRowKeys !== selectedRowKeys && selectedRowKeys) {
      this.setState({ selectedRowKeys })
    }
    if (this.props.reLoadingStatus !== reLoadingStatus && reLoadingStatus) {
      this.removeLodingTable()
    } else {
      this.loadingTableData(props) // 当 props 的值改变的时候重新查询值
    }
  }

  /**
   * 组件销毁之前 对 state 的状态做出处理
   */
  componentWillUnmount () {
    const { sessionPageKey, searchParams } = this.props
    const { current, pageSize } = this.state.pagination
    if (sessionPageKey) {
      SysUtil.setSessionStorage(sessionPageKey, { current, pageSize, searchParams: searchParams })
    }
    this.setState = (state, callback) => {}
  }

  /**
   * 加载数据
   */
  loadingTableData = (props: any = this.props) => {
    const { state, api } = this
    const page = state.pagination.current as number
    const pageSize = state.pagination.pageSize as number
    const params = { page, pageSize, ...props.searchParams }
    this.setState({ loading: true })
    this.axios.request(props.URL, params).then(({ data }:any) => {
      const { pagination } = state
      let dataObj = []
      if (!JudgeUtil.isEmpty(data)) {
        if (process.env.SERVICE_URL === 'pre') {
          if (data.data.length > 0 && data.data[0].projectName) {
            data.data = data.data.filter((el:any) => el.projectName.indexOf('物美') < 0)
          }
        }
        if (JudgeUtil.isArrayFn(data)) { // 返回的值为数组的时候
          dataObj = data
        } else {
          pagination.total = data.totalNum
          dataObj = data.data
        }
        if (props.index) {
          dataObj.forEach((item: any, i: number) => {
            item.index = (i + 1) + (page - 1) * pageSize
          })
        }
      }
      this.setState({
        dataSource: dataObj,
        pagination,
        loading: false
      })
    }).catch((err:any) => {
      const { msg } = err
      this.$message.error(msg || err)
      this.setState({ loading: false })
    })
  }

  /**
   * 点击表格任意一行选中或者取消选中
   */
  selectedCurrentRow = (row: KeyValue) => {
    const key = this.props.filterKey as string
    const currentVal = row[key]
    const type = this.props.rowSelectionType
    const selectedRowKeys = this.state.selectedRowKeys as (string|number)[]
    const selectedRows = this.state.selectedRows as KeyValue[]
    if (type === 'radio') {
      selectedRowKeys.splice(0)
      selectedRows.splice(0)
      selectedRowKeys.push(currentVal)
      selectedRows.push(row)
    } else {
      const { include, index } = ComUtil.inArray(currentVal, selectedRowKeys)
      if (include) {
        selectedRows.some((item, i) => {
          if (currentVal === item[key]) {
            selectedRowKeys.splice(index, 1)
            selectedRows.splice(i, 1)
            return true
          }
          return false
        })
      } else {
        selectedRowKeys.push(currentVal)
        selectedRows.push(row)
      }
    }
    this.setState({
      selectedRowKeys,
      selectedRows
    })
    this.submitSelectedRow(selectedRowKeys, selectedRows)
  }

  /**
   * 提供该接口，以供父组件可能需要用到表格选中的数据
   */
  submitSelectedRow = (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
    const { rowSelection, getSelectedRow } = this.props
    rowSelection && getSelectedRow && (getSelectedRow as Function)(selectedRowKeys, selectedRows)
  }

  /**
   * 删除之后计算
   * @param num  删除了几条数据
   */
  removeLodingTable = (num?:number) => {
    const { onReLoadingStatus } = this.props
    const { pagination, dataSource } = this.state
    if (num) {
      let pageSize = dataSource.length - num
      let current:any = pagination.current
      if (pageSize === 0) {
        pagination.current = current > 1 ? current - 1 : current
      }
    }
    if (onReLoadingStatus) {
      onReLoadingStatus(false)
    }
    this.setState({
      selectedRowKeys: [],
      selectedRows: [],
      pagination
    })
  }

  /** 表格排序和筛选的 */
  handleTableChange = (pagination: any, filters: any, sorter: any) => {
    // console.log(sorter)
  }

  render () {
    const { onRow, scroll, rowKey, columns, rowSelection, rowSelectionFixed, rowSelectionType, bordered } = this.props
    const { dataSource, pagination, selectedRowKeys, isPagination, loading } = this.state
    const hasData = dataSource.length > 0
    const setScroll = hasData ? scroll : scroll
    let isOnRow, isRowSelection
    // 设置点击当前行任意位置取消/选中行
    if (onRow && rowSelection) {
      isOnRow = (row: KeyValue) => {
        return {
          onClick: () => {
            this.selectedCurrentRow(row)
          }
        }
      }
    }
    // 设置第一列为多选
    if (rowSelection) {
      const { onSelect, onSelectAll } = this.props
      isRowSelection = {
        type: rowSelectionType,
        fixed: hasData && rowSelectionFixed,
        selectedRowKeys,
        onChange: (selectedRowKeys: (string|number)[], selectedRows: KeyValue[]) => {
          this.setState({
            selectedRowKeys,
            selectedRows
          })
          this.submitSelectedRow(selectedRowKeys, selectedRows)
        },
        onSelect: (record:any, selected:any, selectedRows:any, nativeEvent:any) => {
          if (onSelect) {
            onSelect(record, selected, selectedRows)
          }
        },
        onSelectAll: (selected:any, selectedRows:any, changeRows:any) => {
          if (onSelectAll) {
            onSelectAll(selected, selectedRows, changeRows)
          }
        }
      }
    }
    return (
      <div className="table-content">
        <Table<T>
          className={`table ${onRow && rowSelection ? 'select_row' : null}`}
          size="middle"
          onRow={isOnRow}
          rowSelection={isRowSelection}
          scroll={setScroll}
          rowKey={rowKey}
          columns={columns}
          loading={loading}
          bordered={bordered}
          pagination={isPagination ? hasData ? pagination : false : false }
          onChange={this.handleTableChange}
          dataSource={dataSource} />
      </div>
    )
  }
}
