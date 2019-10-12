/**
 * @author minjie
 * @createTime 2019/03/22
 * @description typescipt 资源文件的加载 ts
 * @copyright minjie<15181482629@163.com>
 */

declare module '*.less' {
  const content: any
  export = content
}

declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
declare module '*.pdf'

// @types/ 中的文件的信息 自定义可一个分装组件 时使用
declare module 'rc-upload';
