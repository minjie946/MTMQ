/**
 * @author minjie
 * @class 公共的一些验证
 * @createTime 2019/06/14
 * @description from 表单的一些验证
 * @copyright minjie<15181482629@163.com>
 */
import { JudgeUtil } from './ComUtil'

export default class ValidateUtil {
  /** 验证中英文 */
  static validateName = (rule:any, value:any, callback:any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z\s]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      callback(new Error('请输入中文或英文'))
    }
    callback()
  }

  /** 限制首位不为空格 且 不能 输入特殊字符 */
  static getValueFromEventName = (e:any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/^\s*|\s*$/g, '').replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '')
  }

  /** 限制首位不为空格 */
  static getValueFromMessagePush = (e:any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/^\s*|\s*$/g, '')
  }

  /** 限制首位不为空格 */
  static getValueFromEventFirstEmpty = (e:any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '')
  }

  /** 限制首位不为空格 */
  static getValueFromEventFirstEmptyThere = (e:any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/[`~!@#$%^&*()_\-+=<>?:"{}|,.\\/;\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g, '')
  }

  /** 验证电话 */
  static validatePhone = (rule:any, value:any, callback:any) => {
    let reg = /^1(3|4|5|6|7|8|9)\d{3,9}$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号'))
    }
    callback()
  }

  /** 验证电话 */
  static validatePhoneTwo = (rule:any, value:any, callback:any) => {
    let reg = /^1(3|4|5|6|7|8|9)\d{9}$/
    if (!reg.test(value)) {
      callback(new Error('请输入正确的手机号'))
    }
    callback()
  }

  /** 联系方式 */
  static validateContactInformation = (rule:any, value:any, callback:any) => {
    let regOne = /^1(3|4|5|6|7|8|9)\d{3,9}$/
    let regThere = /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/
    if (regOne.test(value) || regThere.test(value)) {
      callback()
    } else {
      callback(new Error('请输入正确的联系方式'))
    }
    callback()
  }

  /** 限制不能输入空格 */
  static getValueFromEventPhone = (e:any) => {
    let value = e.target.value
    return value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
  }

  /** 验证中文 */
  static validateChinese = (rule:any, value:any, callback:any) => {
    let reg = /^\S[\u0391-\uFFE5]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      callback(new Error('请输入中文名称'))
    }
    callback()
  }

  /** 验证中文英文数字 */
  static validateChEnNumber = (rule:any, value:any, callback:any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z0-9]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      callback(new Error('请输入中文英文数字'))
    }
    callback()
  }

  /** 验证岗位 */
  static validatePostName = (rule:any, value:any, callback:any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      callback(new Error('请输入中文名称'))
    }
    callback()
  }

  /** 验证地址 */
  static validateAddress = (rule:any, value:any, callback:any) => {
    let reg = /^\S[\u0391-\uFFE5a-zA-Z]+$/
    if (!reg.test(value) || JudgeUtil.isEmpty(value)) {
      callback(new Error('请输入中文'))
    }
    callback()
  }

  /** 验证输入数字 */
  static validateSalary = (rule:any, value:any, callback:any) => {
    let reg = /^\d+$/
    if (!reg.test(value)) {
      callback(new Error('请输入数字'))
    }
    callback()
  }

  /** 限制输入数字，不能输入小数点， 不能为负 */
  static getValueFromEventNumber = (e:any) => {
    let value = e.target.value
    value = value.replace(/^\s*/g, '').replace(/[^\d]/g, '')
    if (Number(value) < 0) {
      return 0
    }
    return JudgeUtil.isEmpty(value) ? value : Number(value)
  }

  /**
   * 保留小数点，默认保留两位
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
   */
  static toFixed (v: string, decimalsLen: number = 2, intLen: number = 2) {
    v = v
      .substr(0, intLen + decimalsLen + 1)
      .replace(/[^\d.]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
      .replace(/^\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    return v
  }
}

export const formItemCol = { sm: 9, lg: 9, xl: 8, xxl: 6 }
