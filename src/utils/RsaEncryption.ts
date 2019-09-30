/**
 * @description RSA加密工具类
 * @author minjie
 * @class RsaEncryption
 * @createTime 2019/09/07
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */

const key = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPVwjLt+RXmEm1yBP8hOhkNrmpiByA/OPt3qbsITnFoWvzPIfjOgdBYZvOSrU6ky0jbt02dvS6nWQFHShKZa50WYSRLjtj6pUO6r/N/EhfQNFZdTj4ZMvq1gWbG49zikkSSCrrxU79gxv8b8NsQK/mfp8QXiU4bdGZxiBD1fTslQIDAQAB'

export const encryptedString = (pwd:string) => {
  let JSEncrypt = (window as any).JSEncrypt
  let encrypt = new JSEncrypt()
  encrypt.setPublicKey(key)
  return encrypt.encrypt(pwd)
}
