/**
 * @author maqian
 * @createTime 2019/04/02
 * @description 路由的， 面包屑展示
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action } from 'mobx'

class BreadcrumbRouter {
  @observable.struct
  breadcrumbAry:Array<any> = []

  @observable.struct
  openKeys:Array<any> = []
  @observable.struct
  selectedKeys:Array<any> = []

  @action
  setBreadcrumbAry = (list: Array<any>) => {
    this.breadcrumbAry = list
  }

  @action
  setDefaultSelectedKeys = (sub:any, par:any) => {
    if (par) this.openKeys = [par.path]
    if (sub) this.selectedKeys = [sub.path]
  }

  @action
  setOpenKeys = (list: Array<any>) => {
    this.openKeys = list
  }
}

export default new BreadcrumbRouter()
