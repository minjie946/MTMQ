/**
 * @author minjie
 * @createTime 2019/07/12
 * @description modal 等信息
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { JudgeUtil } from '@utils/index'

/** 富文本操作栏 */
export const controls:any = [
  'undo', 'redo', 'separator', 'font-size',
  'line-height', 'letter-spacing', 'separator',
  'text-color', 'bold', 'italic', 'underline',
  'strike-through', 'separator', 'superscript',
  'subscript', 'remove-styles', 'emoji', 'separator',
  'text-indent', 'text-align', 'separator',
  'headings', 'list-ul', 'list-ol', 'blockquote',
  'code', 'separator', 'separator',
  'hr', 'separator', 'media', 'separator', 'clear', 'separator', 'fullscreen'
]

// 定义rem基准值
const sizeBase = 23.4375

// 定义输入转换函数
export const unitImportFn = (unit:any, type:any, source:any) => {
  // 此函数的返回结果，需要过滤掉单位，只返回数值
  if (unit.indexOf('rem')) {
    return parseFloat(unit) * sizeBase
  } else {
    return parseFloat(unit)
  }
}

// 定义输出转换函数
export const unitExportFn = (unit:any, type:any, target:any) => {
  if (type === 'line-height') {
    // 输出行高时不添加单位
    return unit
  }
  // target的值可能是html或者editor，对应输出到html和在编辑器中显示这两个场景
  if (target === 'html') {
    // 只在将内容输出为html时才进行转换
    return unit / sizeBase + 'rem'
  } else {
    // 在编辑器中显示时，按px单位展示
    return unit + 'px'
  }
}

export class InformationInfo {
  infoContent:string|undefined // 资讯正文
  infoId:number|undefined // 资讯ID
  infoState: number|undefined // 资讯状态
  infoType: string|undefined // 资讯状态
  infoThumbnail:string|undefined // 资讯缩略图
  infoThumbnailURL:string|undefined // 资讯缩略图
  infoTitle:string|undefined // 资讯标题
  userId:number|undefined// 用户ID
  infoIstop: boolean | undefined // 是否置顶
  projectName: string | undefined // 所属项目
}

export class InformationInfoDetail {
  infoCollectionVolume: number|undefined // 咨询收藏量
  infoContent: string|undefined // 咨询正文
  infoForwardingVolume: number|undefined // 咨询转发量
  infoPointPraise: number|undefined // 咨询点赞量
  infoReadingVolume: number|undefined // 咨询入读量
  infoState: number|undefined // 咨询状态
  infoTitle: string|undefined // 咨询标题
  infoIstop: boolean | undefined // 是否置顶
  projectName: string | undefined // 所属项目
}
