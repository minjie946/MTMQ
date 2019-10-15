/**
 * @authors minjie
 * @date    2019/10/15
 * @version 1.0.0 firstVersion
 * @module axios
 * @description server 汇合
 * @copyright minjie<15181482629@163.com>
 */
const files = (require as any).context('.', true, /\.ts$/)
let modules:any = {}

files.keys().forEach((key:string) => {
  if (key === './index.ts') return
  Object.assign(modules, files(key).default)
})

export default modules
