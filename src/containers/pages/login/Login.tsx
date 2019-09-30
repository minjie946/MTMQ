/**
 * @author minjie
 * @createTime 2019/05/23
 * @description 登录界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, Version } from '@components/index'
import { Form, Input, Button } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { SysUtil, globalEnum, JudgeUtil, LoggerUtil, ValidateUtil, encryptedString } from '@utils/index'
import { inject, observer } from 'mobx-react'

import loginBg from '@assets/images/login/loginbg.png'
import logintext from '@assets/images/login/logintext.png'

import './login.styl'

const loginBgStyle = {
  backgroundImage: `url(${loginBg})`
}

interface LoginProps extends FormComponentProps {
  history?:any
  mobxCommon?: any
}

interface LoginState {
  // 按钮禁用
  diableBtn: boolean
  phoneNumber: string
  codeTime:number
  codeShow: boolean
  changePwd: boolean
}

@inject('mobxCommon')
@observer
class Login extends RootComponent<LoginProps, LoginState> {
  private intervalTime:any = null
  constructor (props:any) {
    super(props)
    this.state = {
      diableBtn: false, // 按钮禁用
      phoneNumber: '',
      codeTime: 60,
      codeShow: false,
      changePwd: false
    }
    if (!SysUtil.isAuthExit()) {
      const { getUserInfo, setOrganize } = this.props.mobxCommon
      // 初始化组织信息
      setOrganize()
      // 获取用户的信息
      getUserInfo()
      this.$message.success('欢迎回来！')
      this.props.history.replace('home/homeInfo')
    } else {
      SysUtil.clearLocalStorageAsLoginOut()
    }
  }

  /** 初始加载验证码 */
  componentDidMount () {
    LoggerUtil.log('登录页', '进入登录好饭碗后台')
    let phoneNumber = SysUtil.getLocalStorage('login-name')
    if (phoneNumber) this.setState({ phoneNumber })
  }

  /* 提交 信息 */
  handleSubmit = (e:any) => {
    e.preventDefault() // 取消默认的事件
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // let { phoneNumber, phoneCode } = values
        // this.setState({ diableBtn: true })
        // this.axios.request(this.api.login, {
        //   phoneNumber: phoneNumber,
        //   phoneCode: phoneCode
        // }).then((res:any) => {
        //   let { token, userId } = res.data
        //   SysUtil.setLocalStorage(globalEnum.token, token, 5)
        //   SysUtil.setLocalStorage(globalEnum.userID, userId, 5)
        //   this.setState({ diableBtn: false })
        //   this.clearTimeoutCode()
        //   const { getUserInfo, setOrganize } = this.props.mobxCommon
        //   // 初始化组织信息
        //   setOrganize()
        //   // 获取用户的信息
        //   getUserInfo()
        //   LoggerUtil.log('登录页', '登录好饭碗后台')
        //   this.$message.success('欢迎登录好饭碗后台！')
        //   this.props.history.replace('home/homeInfo')
        // }).catch((err:any) => {
        //   let { msg } = err
        //   this.$message.error(msg || err)
        //   this.setState({ diableBtn: false })
        // })
        let { phoneNumber, phoneCode, loginPassword } = values
        // 手机验证码100；手机密码200
        this.setState({ diableBtn: true })
        let loginType = 100
        if (this.state.changePwd) {
          loginType = 200
        }
        this.axiosu.request(this.api.newLogin, {
          authCode: phoneCode,
          loginType,
          userPassword: loginPassword ? encryptedString(loginPassword) : '', // loginPassword,
          userPhone: phoneNumber
        }).then((res:any) => {
          this.setState({ diableBtn: false })
          // 权限code集合 数据权限 用户信息
          const { authoritis, cityProjects, user } = res.data
          // 注册时间 数据来源 用户ID 用户邮箱 用户名 手机号  注册设备 用户角色
          const { userCtime, userDataSources, userID, userMail, userName, userPhone, userRegisterDevice, userRoles } = user
          // 角色ID 角色名称
          const { charID, charName } = userRoles
          SysUtil.setLocalStorage(globalEnum.userID, userID, 5)
          this.clearTimeoutCode()
          const { getUserInfo, setOrganize } = this.props.mobxCommon
          // 初始化组织信息
          setOrganize()
          // 获取用户的信息
          getUserInfo()
          LoggerUtil.log('登录页', '登录好饭碗后台')
          this.$message.success('欢迎登录好饭碗后台！')
          this.props.history.replace('home/homeInfo')
        }).catch((err:any) => {
          this.$message.error(err.msg || err)
          this.setState({ diableBtn: false })
        })
      }
    })
  }

  /** 对权限树进行补全 */
  subCode = (code:string, codeAry:Array<string>) => {
    code = code.substring(1)
    let a = code.substring(0, 3)
    let b = code.substring(3, 6)
    let c = code.substring(6, 9)
    if (parseInt(c) > 0) {
      let str = 'H' + a + b + '000'
      if (codeAry.indexOf(str) < 0) {
        codeAry.push(str)
      }
      this.subCode(str, codeAry)
    } else if (parseInt(b) > 0) {
      let str = 'H' + a + '000000'
      if (codeAry.indexOf(str) < 0) {
        codeAry.push(str)
      }
    }
  }

  /** 验证码的验证 */
  validatorCode = (rules:any, value:any, callback:any) => {
    if (JudgeUtil.isEmpty(value) || value.length !== 6) {
      callback(new Error('请输入6位验证码'))
    }
    callback()
  }

  /** 密码验证 */
  validatorPwd = (rules:any, value:any, callback:any) => {
    if (JudgeUtil.isEmpty(value) || value.length < 6) {
      callback(new Error('密码长度在6～16之间'))
    }
    callback()
  }

  /** 获取验证码code */
  getCode = () => {
    let { getFieldValue, setFields } = this.props.form
    let phone = getFieldValue('phoneNumber')
    if (!JudgeUtil.isEmpty(phone)) {
      // 判断正在获取的则不能获取了
      if (!this.intervalTime) {
        this.axiosu.request(this.api.newSendPhoneCode, { userPhone: phone }).then((res:any) => {
        // this.axios.request(this.api.formalSendLoginCode, { phone }).then((res:any) => {
          const { code } = res
          if (code === 200) { // 发送验证码成功
            this.setTimeoutCode()
            LoggerUtil.log('登录页', '获取验证码')
            this.$message.success('验证码发送成功！')
          }
        }).catch((err:any) => {
          this.$message.error(err.msg || err)
        })
      }
    } else {
      setFields({ phoneNumber: { value: phone, errors: [new Error('请输入账号')] } })
    }
  }

  /** 设置验证码倒计时 */
  setTimeoutCode = () => {
    if (this.intervalTime) {
      clearInterval(this.intervalTime)
    }
    this.intervalTime = setInterval(() => {
      let { codeTime, codeShow } = this.state
      if (codeTime === 0) {
        codeTime = 60
        codeShow = false
        clearInterval(this.intervalTime)
        this.intervalTime = null
      } else {
        codeTime = codeTime - 1
        codeShow = true
      }
      this.setState({ codeTime, codeShow })
    }, 1000)
  }

  /** 清除信息 */
  clearTimeoutCode = () => {
    clearInterval(this.intervalTime)
    this.intervalTime = null
    this.setState({ codeTime: 60, codeShow: false })
  }

  componentwillunmount = () => {
    this.setState(() => {})
    if (this.intervalTime) clearInterval(this.intervalTime)
    this.intervalTime = null
  }

  /** 切换密码 */
  changePwd = () => {
    this.setState({ changePwd: !this.state.changePwd })
  }

  render () {
    const { getFieldDecorator } = this.props.form
    const { diableBtn, phoneNumber, codeTime, codeShow, changePwd } = this.state
    return (
      <div className="login-content" style={loginBgStyle}>
        <div className="login-card">
          <p><img src={logintext}/></p>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item className="from-item">
              {getFieldDecorator('phoneNumber', {
                initialValue: phoneNumber,
                rules: [{ required: true, validator: ValidateUtil.validatePhoneTwo }],
                getValueFromEvent: ValidateUtil.getValueFromMessagePush
              })(
                <Input allowClear type="text" id="phoneNumber" size="large" placeholder="请输入账号" />
              )}
            </Form.Item>
            {changePwd ? <Form.Item className="from-item">
              {getFieldDecorator('loginPassword', {
                rules: [{ required: true, validator: this.validatorPwd }],
                getValueFromEvent: ValidateUtil.getValueFromMessagePush
              })(
                <Input.Password allowClear visibilityToggle={false} minLength={6} maxLength={16} size="large" type="text" placeholder="请输入密码" />
              )}
            </Form.Item>
              : <Form.Item className="from-item">
                {getFieldDecorator('phoneCode', {
                  rules: [{ required: true, validator: this.validatorCode }],
                  getValueFromEvent: ValidateUtil.getValueFromMessagePush
                })(
                  <Input allowClear maxLength={6} size="large" type="text" placeholder="请输入6位验证码"
                    addonAfter={<span onClick={this.getCode} className="get-code">
                      {codeShow ? `${codeTime}秒` : '获取验证码'}
                    </span>} />
                )}
              </Form.Item>
            }
            <Form.Item className="from-item">
              <Button type="primary" disabled={diableBtn} block={true} size="large" htmlType="submit">登录</Button>
              <p className='login-change' onClick={this.changePwd}>{changePwd ? '验证码登录' : '密码登录'}</p>
            </Form.Item>
          </Form>
        </div>
        <Version color="cus-version-color-b"/>
      </div>
    )
  }
}
export default Form.create({ name: 'normal_login' })(Login)
