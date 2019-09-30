/**
 * @author minjie
 * @createTime 2019/07/2
 * @description 组织的搜索
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
/**
 * 搜索的信息
 */
export const searchFun = (ary:any, where:string) => {
  return treeFilter(setFlag(ary, where))
}
export const setFlag = (ary:any, where:string) => {
  return ary.map((item:any) => {
    item.isNeed = isNeedBranch(item, where)
    if (item.next && item.next.length) {
      searchFun(item.next, where)
    }
    return item
  })
}
export const isNeedBranch = (item:any, keyword:string) => {
  let flag1 = false
  let flag2 = false
  if (item.organize.indexOf(keyword) > -1) {
    flag1 = true
  } else if (item.next && item.next.length) {
    item.next.forEach((child:any) => {
      if (isNeedBranch(child, keyword)) {
        flag2 = true
      }
    })
  }
  return flag1 || flag2
}
/** 筛选处不能输出的 */
export const treeFilter = (data:any) => {
  return data.filter((item:any, index:any) => {
    if (item && item.next && item.next.length) {
      item.next = treeFilter(item.next)
    }
    return item.isNeed
  })
}
/** 选择成功之后的 */
export const checkOKFun = (ary:any, where:Array<string>) => {
  let objAry = [...where]
  let sa = setFlagOK(ary, objAry, '', 0)
  console.log(sa)
  return [] // treeFilter(sa)
}
export const setFlagOK = (ary:any, objAry:Array<string>, keys:string, orid:any) => {
  return ary.map((item:any) => {
    // console.log()
    if (item.parentId === orid) {
      item.isNeed = isNeedBranchOK(item, objAry, keys)
    }
    if (item.next && item.next.length) {
      keys = keys === '' ? item.organize : keys + '-' + item.organize
      setFlagOK(item.next, objAry, keys, item.orid)
    }
    return item
  })
}
export const isNeedBranchOK = (item:any, objAry:Array<string>, keys:string) => {
  let flag1 = false
  let flag2 = false
  keys = keys === '' ? item.organize : keys + '-' + item.organize
  // console.log(keys, objAry, item.organize)
  if (objAry.indexOf(keys) > -1) {
    flag1 = true
  } else if (item.next && item.next.length) {
    item.next.forEach((child:any) => {
      if (isNeedBranchOK(child, objAry, keys)) {
        flag2 = true
      }
    })
  }
  return flag1 || flag2
}
