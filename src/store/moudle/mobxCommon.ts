/**
 * @author minjie
 * @createTime 2019/05/24
 * @description 初始化的信息请求设置
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import { observable, action } from 'mobx'
import { HFWAxios as Axios } from '@components/index'
import ServerApi from '@server/ServerApi'
import { SysUtil, globalEnum, JudgeUtil } from '@utils/index'
import { message } from 'antd'

class MobxCommon {
  constructor () {
    let projectAry = SysUtil.getLocalStorage(globalEnum.projectAry) || []
    let project = SysUtil.getLocalStorage(globalEnum.project)
    let organizeAry = SysUtil.getLocalStorage(globalEnum.commonOrganize)
    if (JudgeUtil.isEmpty(project)) {
      if (projectAry.length > 0) {
        project = projectAry.find((el:any) => el.projectName.indexOf('上嘉') >= 0).projectName
      } else {
        project = '上嘉'
      }
    }
    this.project = project
    this.subjectData = []
    this.projectAry = projectAry
    this.organizeAry = organizeAry
  }

  /** 当前的项目 */
  @observable.struct
  project:string = ''

  @observable.struct
  projectAry:Array<any> = []

  /** 主体的选项 */
  @observable.struct
  subjectData:Array<string> = []

  /** 当前的组织选择 */
  @observable.struct
  organizeAry:Array<string> = []

  /** 资讯的信息 */
  @observable.struct
  informationAry:Array<any> = []

  @action
  setInformationAry = (informationAry:Array<any>) => { // 设置值
    this.informationAry = informationAry
  }

  @action
  setProject = (project:string) => { // 设置值
    this.project = project
    this.getCompanyNamePro(project)
    this.getOrganizeAry(project)
    SysUtil.setLocalStorage(globalEnum.project, project)
  }

  @action
  setSubjectData = (subjectData:Array<string>) => {
    this.subjectData = subjectData
  }

  @action
  setOrganizeAry = (organizeAry:Array<string>) => {
    this.organizeAry = organizeAry
  }

  @action
  setProjectAry = (projectAry:any) => {
    if (process.env.SERVICE_URL === 'pre') {
      projectAry = projectAry.filter((el:any) => el.projectName.indexOf('物美') < 0)
    }
    this.projectAry = projectAry
    SysUtil.setLocalStorage(globalEnum.projectAry, projectAry, 5)
  }

  @action
  setOrganize = () => { // 设置值
    Axios.request(ServerApi.companyGetProject).then((res:any) => {
      this.setProjectAry(res.data)
      if (JudgeUtil.isEmpty(this.project)) {
        let a = res.data.find((el:any) => el.projectName.indexOf('上嘉') >= 0)
        this.setProject(a.projectName)
      }
    })
    Axios.request(ServerApi.commonOrganizeTree, {}).then((res:any) => {
      SysUtil.setLocalStorage(globalEnum.commonOrganize, res.data, 5)
    }).catch((err:any) => {
      console.log(err.msg)
    })
  }

  @action
  getUserInfo = () => { // 获取用户的信息
    let userId = SysUtil.getLocalStorage(globalEnum.userID)
    Axios.request(ServerApi.getUserInfo, { userId }).then((res:any) => {
      const { data } = res
      SysUtil.setLocalStorage(globalEnum.admin, data, 5)
    }).catch((err:any) => {
      let { msg } = err
      console.error('获取用户信息失败: ' + (msg || err))
    })
  }

  @action
  getOrganizeAry = (value:any) => {
    /** 项目改变 查询组织的信息 */
    let organizeArySum: Array<any> = SysUtil.getLocalStorage(globalEnum.commonOrganize) || []
    let ary = organizeArySum.find((el:any) => el.organize.indexOf(value) >= 0)
    let organizeAry = ary ? [ary] : []
    this.setOrganizeAry(organizeAry)
  }

  @action
  getCompanyNamePro = (pro:string) => { // 根据项目名称查询合同主体(公司名称)
    Axios.request(ServerApi.companyGetCompanyNamePro, { pro }).then((res:any) => {
      this.setSubjectData(res.data)
    }).catch((err:any) => {
      const { msg } = err
      message.error(msg || err)
    })
  }

  @action // 获取资讯的信息
  getInfomation = () => {
    Axios.request(ServerApi.informationQuery, {
      current: 1, // 当前的页
      pageSize: 9999 // 每页显示的条数
    }).then((res:any) => {
      const { data } = res.data
      this.setInformationAry(data)
    }).catch((err:any) => {
      const { msg } = err
      message.error(msg || err)
    })
  }
}

export default new MobxCommon()
