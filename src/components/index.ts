/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 组件的输出
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

// 基础组件
import RootComponent from './root/RootComponent'
// 表格
import TableItem from './table/TableItem'
// 加载
import Loading from './loading/Loading'
// Axios
import Axios, { UserAxios, HFWAxios } from './axios/Axios'
// 时间
import BasicDatePicker from './date/BasicDatePicker'
// 月份连选
import BasicMonthRangePicker from './date/BasicMonthRangePicker'
// 版本
import Version from './version'
// model框
import BasicModal from './modal/BasicModal'
// excel 文件导入
import ExcelFileImport from './uploadexcel'
// 下载数据
import Dowload from './dowload'
// 图片上传
import UploadImage from './uploadimage'
// 图片预览
import ImgPreview from './image/index'
/** 进度条 */
import Progress from './progress/index'
/** 图片和视频的预览 */
import Preview from './preview/index'

export {
  Axios,
  UserAxios,
  HFWAxios,
  RootComponent,
  Loading,
  BasicDatePicker,
  BasicMonthRangePicker,
  TableItem,
  Version,
  BasicModal,
  Dowload,
  ExcelFileImport,
  UploadImage,
  ImgPreview,
  Preview,
  Progress
}
