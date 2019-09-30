/**
 * @description OSS 服务文件
 * @author minjie
 * @createTime 2018/10/18
 * @copyright Copyright © 2018 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { HFWAxios as Axios } from '@components/index'
import ServerApi from '@server/ServerApi'
import { ConfigUtil, SysUtil, OssPathEnum } from '@utils/index'
const OSSClient = require('ali-oss')

export default class OSSUtil {
  /**
   * oss 上传文件
   * @param file   文件对象
   * @param folder 文件保存地址
   */
  static uploadFileStream (file:any, folder:string) {
    return new Promise((resolve, reject) => {
      OSSUtil.getOssKey().then(async ({ accessKeyId, accessKeySecret, expiration, securityToken }:any) => {
        try {
          var client:any = new OSSClient({
            region: ConfigUtil.OSSRegion,
            accessKeyId: accessKeyId,
            accessKeySecret: accessKeySecret,
            bucket: ConfigUtil.OSSPrivateBucket,
            stsToken: securityToken,
            secure: true
          })
          let progress: number = 0
          let name = folder + '/' + OSSUtil.fileNameByTime(file.name)
          let result = await client.multipartUpload(name, file, {
            progress
          })
          resolve({ name: result.name, url: result.url })
        } catch (e) {
          console.log(e)
          reject(e)
        }
      })
    })
  }

  /**
   * 获取oss的key
   */
  static getOssKey () {
    // STS安全令牌-临时授权
    return new Promise((resolve, reject) => {
      let ossKey = SysUtil.getSessionStorage(OssPathEnum.ossKey)
      // 判断存在且是否超时
      if (ossKey) {
        if (new Date().getTime() < new Date(ossKey.expiration).getTime()) {
          resolve(ossKey)
        } else {
          Axios.request(ServerApi.ossGetkey).then((res:any) => {
            // accessKeyId, accessKeySecret, expiration, securityToken
            SysUtil.setSessionStorage(OssPathEnum.ossKey, res.data)
            resolve(res.data)
          }).catch((err:any) => {
            console.log(err)
          })
        }
      } else {
        Axios.request(ServerApi.ossGetkey).then((res:any) => {
          // accessKeyId, accessKeySecret, expiration, securityToken
          SysUtil.setSessionStorage(OssPathEnum.ossKey, res.data)
          resolve(res.data)
        }).catch((err:any) => {
          console.log(err)
        })
      }
    })
  }

  /**
   * 根据时间生成信息
   * @method notReaname
   * @param {String} filePath  路径
   */
  static fileNameByTime (filePath:string) {
    let suffer = filePath.substring(filePath.lastIndexOf('.'))
    let date = new Date()
    let timestamp = date.getTime()
    return 'hfw' + '_' + timestamp + suffer
  }
}
