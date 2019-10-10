/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 组件的输出
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

// 基础组件
import RootComponent from './root/RootComponent'
// 加载
import Loading from './loading/Loading'
// Axios
import Axios, { UserAxios, HFWAxios } from './axios/Axios'
// 版本
import Version from './version'
// model框
import BasicModal from './modal/BasicModal'

export {
  Axios,
  UserAxios,
  HFWAxios,
  RootComponent,
  Loading,
  Version,
  BasicModal
}
