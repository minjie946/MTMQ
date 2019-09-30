/*
 * @description: 通用工具
 * @author: huxianghe
 * @lastEditors: huxianghe
 * @Date: 2019-04-05 14:05:14
 * @LastEditTime: 2019-05-06 11:10:56
 * @copyright: Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

export class ComUtil {
  /**
   * 判断目标元素是否存在指定数组中
   * @param ele 目标元素
   * @param array 目标数组
   */
  static inArray (ele: string | number, array: (string|number)[]) {
    const i = array.indexOf(ele)
    return {
      include: i !== -1,
      index: i
    }
  }

  /* 深度对比两个对象是否相同 */
  static compareDeep (origin: any, target: any) {
    let p
    if (typeof origin === 'number' && typeof target === 'number' && isNaN(origin) && isNaN(target)) {
      return true
    }
    if (origin === target) {
      return true
    }
    if (typeof origin === 'function' && typeof target === 'function') {
      if ((origin instanceof RegExp && target instanceof RegExp) ||
      (origin instanceof String || target instanceof String) ||
      (origin instanceof Number || target instanceof Number)) {
        return origin.toString() === target.toString()
      } else {
        return false
      }
    }
    if (origin instanceof Date && target instanceof Date) {
      return origin.getTime() === target.getTime()
    }
    if (!(origin instanceof Object && target instanceof Object)) {
      return false
    }
    if (origin.prototype !== target.prototype) {
      return false
    }
    if (origin.constructor !== target.constructor) {
      return false
    }
    for (p in target) {
      if (!origin.hasOwnProperty(p)) {
        return false
      }
    }
    for (p in origin) {
      if (!target.hasOwnProperty(p)) {
        return false
      }
      if (typeof target[p] !== typeof origin[p]) {
        return false
      }
      if (!ComUtil.compareDeep(origin[p], target[p])) {
        return false
      }
    }
    return true
  }
}

export class JudgeUtil {
  /*  获取原始类型 */
  static toRawType (v: any) {
    return Object.prototype.toString.call(v).slice(8, -1).toLowerCase()
  }

  /**
   * 判断是否是数字
   * @param obj 需要判断的值
   */
  static isNumber (obj:any):boolean {
    return typeof obj === 'number' && isFinite(obj)
  }

  /** 判读是否是数组 */
  static isArrayFn (value:any) {
    if (typeof Array.isArray === 'function') {
      return Array.isArray(value)
    } else {
      return JudgeUtil.toRawType(value) === 'array'
    }
  }

  /* 判断是否为纯对象 */
  static isPlainObj (obj: any) {
    return JudgeUtil.toRawType(obj) === 'object'
  }

  /**
   * 判读是否为空
   */
  static isEmpty (obj:any) {
    return (typeof obj === 'undefined' || obj === null || obj === '')
  }

  /** ---------------------------------表单内容 start --------------------------------- */

  static intLen: number = 8
  static decimalsLen: number = 2

  /* 只允许输入整数 */
  static parsetInt (v: string, intLen = JudgeUtil.intLen) {
    return v.substr(0, intLen).replace(/[^\d]/g, '')
  }

  /* 只允许输入整数且支持可以保留负号 */
  static parsetIntAndKeepMinus (v: string, intLen = JudgeUtil.intLen) {
    v = v
      .replace(/[^\d-]/g, '')
      .replace(/-{1,}/g, '-')
      .replace(/^-/, '$#$')
      .replace(/-/g, '')
      .replace('$#$', '-')
    if (v.indexOf('-') > -1) intLen += 1
    return v.substr(0, intLen)
  }

  /**
   * 保留小数点，默认保留两位
   * @param v 待处理字符串
   * @param decimalsLen 小数点位数
   * @param intLen 整数位数
   */
  static toFixed (v: string, decimalsLen = JudgeUtil.decimalsLen, intLen = JudgeUtil.intLen) {
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

  /* 保留小数点和负号，小数点默认保留两位 */
  static toFixedAndKeepMinus (v: string, decimalsLen = JudgeUtil.decimalsLen, intLen = JudgeUtil.intLen) {
    v = v
      .replace(/[^\d.-]/g, '')
      .replace(/^\./, '')
      .replace(/\.{2,}/g, '.')
      .replace('.', '$#$')
      .replace(/\./g, '')
      .replace('$#$', '.')
      .replace(/-{1,}/g, '-')
      .replace(/^-/, '$#$')
      .replace(/-/g, '')
      .replace('$#$', '-')
      .replace(new RegExp(`^(\\d+)\\.(\\d{0,${decimalsLen}}).*$`), '$1.$2')
    if (v.indexOf('-') > -1) intLen += 1
    v = v
      .replace(/^-?\d+/, (match: string) => {
        return (parseFloat(match) + '').substr(0, intLen)
      })
    return v.substr(0, intLen + decimalsLen + 1)
  }

  /**
   * 转换限制
   * @param reg 表达式
   * @param val 转换值
   * @param len 长度
   */
  static conversionOf (reg:any, val:string, len?:number):string {
    val = val.replace(reg, '')
    if (len) {
      val = val.length > len ? val.substr(0, len) : val
    }
    return val
  }

  /**
   * 去除空格
   */
  static removeEmpty = (val:any) => {
    return val.replace(/(^\s*)|(\s*$)/g, '')
  }

  /** ---------------------------------表单内容 end --------------------------------- */

  /**
   * 对金额进行格式化
   * @method doubleFormat
   * @param {*} number   要格式化的数字
   * @param {*} decimals 保留几位小数
   * @returns            返回格式化之后的金额
   */
  static doubleFormat (number:any, decimals:number) {
    decimals = decimals >= 0 && decimals <= 20 ? decimals : 2
    number = parseFloat((number + '').replace(/[^\d\.-]/g, '')).toFixed(decimals) + ''
    let l = number.split('.')[0].split('').reverse()
    let r = number.split('.')[1]
    r = r == null ? '' : '.' + r
    var t = ''
    if (l[l.length - 1] === '-') { // 负数不需要分隔号,
      for (var i = 0; i < l.length; i++) {
        if (l[i] === '-') {
          t += l[i] + ''
          continue
        }
        // 不是数组的倒数第二个元素才加',' ['0', '4', '5', '-']
        t += l[i] + ((i + 1) % 4 === 0 && i + 1 !== l.length - 1 ? ',' : '')
        // i + 1 != l.length会变成-,540.00,因为在5时元素位置2+1为3非数组长度
        // t += l[i] + ((i + 1) % 3 == 0 && i + 1 != l.length ? ',' : '');
      }
    } else {
      for (let i = 0; i < l.length; i++) {
        t += l[i] + ((i + 1) % 4 === 0 && i + 1 !== l.length ? ',' : '')
      }
    }
    return (t.split('').reverse().join('') + r)
  }
}
