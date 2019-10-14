/**
 * @author minjie
 * @createTime 2019/10/14
 * @description 404
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { RootComponent, URLInterface } from '@components/index'
import { TableProps, PaginationConfig } from 'antd/lib/table/interface'
import { Table } from 'antd'
import { JudgeUtil } from '@utils/index'

interface TableItemProps<T> extends TableProps<T> {
  /** 查询远程的信息 */
  URL?: URLInterface
  /** 查询的条件 */
  searchParams?: any
  /** 每页显示的条数 */
  pageSize?: number
  /** index */
  index?: boolean
  /** 是否需要 */
  isPagination?: boolean
  /** 删除之后重新调用的 */
  onReLoadingStatus?: (flag: boolean) => void
}

interface TableItemState<T> {
  pagination: PaginationConfig
  loading: boolean
  dataSource: T[]
}

export default class TableItem<T> extends RootComponent<TableItemProps<T>, TableItemState<T>> {
  static defaultProps = {
    pageSize: 10,
    index: true,
    isPagination: true
  }
  constructor (props:any) {
    super(props)
    const { pageSize } = props
    let minHeight = document.body.clientHeight - 100
    this.state = {
      loading: false,
      pagination: {
        current: 1, // 当前的页
        pageSize: minHeight > 900 ? 20 : pageSize, // 每页显示的条数
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
        showTotal: (total) => `共${total}条`
      },
      dataSource: []
    }
  }

  loadingTableData = () => {
    const {
      state: { pagination: { current: page, pageSize } },
      props: { URL, searchParams, index },
      axios: { request }
    } = this
    const params = { page, pageSize, ...searchParams }
    this.setState({ loading: true })
    if (URL) {
      request(URL, params).then(({ data }:any) => {
        const { pagination } = this.state
        let dataSource = []
        if (JudgeUtil.isArrayFn(data)) { // 返回的值为数组的时候
          dataSource = data
        } else {
          pagination.total = data.totalNum
          dataSource = data.data
        }
        if (index && page && pageSize) {
          dataSource.forEach((item: any, i: number) => {
            item.index = (i + 1) + (page - 1) * pageSize
          })
        }
        this.setState({ dataSource, pagination, loading: false })
      }).catch((err:any) => {
        this.$message.error(err.msg || err)
        this.setState({ loading: false })
      })
    }
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
    this.setState({ pagination })
  }

  render () {
    const {
      state: { dataSource, pagination, loading },
      props: { isPagination }
    } = this
    return (
      <Table<T>
        {...this.props}
        loading={loading}
        pagination={isPagination && dataSource.length > 0 ? pagination : false}
        dataSource={dataSource}
      />
    )
  }
}
