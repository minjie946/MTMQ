/**
 * @author minjie
 * @createTime 2019/05/14
 * @description 主界面
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent, Version } from '@components/index'
import { Menu, Icon, Layout, Avatar, Breadcrumb, Dropdown } from 'antd'
import { inject, observer } from 'mobx-react'
import CustomeRouter from '@router/CustomeRouter'
import { SysUtil, globalEnum, LoggerUtil } from '@utils/index'

import './style/home.styl'

import avatar from '@assets/images/avatar.png'
import icon from '@assets/images/icon.png'

const { Header, Content, Sider, Footer } = Layout

interface HomeProps {
  routes: []
  history?: any,
  mobxRouter:any
  mobxCommon:any
}

interface HomeState {
  collapsed: boolean
  html: any
  admin: any
  auth: any
  silderData: any
  // 界面最小的高度
  minHeight: number
  // 当前的项目
  project: string
}
@inject('mobxRouter')
@inject('mobxCommon')
@observer
export default class Home extends RootComponent<HomeProps, HomeState> {
  private menuItemAry:Array<any> = []
  constructor (props:any) {
    super(props)
    let minHeight = document.body.clientHeight - 100
    this.state = {
      collapsed: false,
      html: null,
      admin: null,
      auth: [],
      silderData: SysUtil.getSessionStorage('home-silder') || [],
      minHeight,
      project: '上嘉'
    }
  }

  private userImage:string = ''

  /** 数据拿去 */
  componentDidMount () {
    // 监听窗口大小的改变
    window.addEventListener('resize', () => {
      let minHeight = document.body.clientHeight - 100
      this.setState({ minHeight })
    })
    this.menuItemAry = this.iterAry(this.state.silderData)
    this.setState({
      auth: [],
      admin: { name: 'admin', nickname: 'admin' }
    })
  }

  componentWillUnmount () {
    this.setState = (state, callback) => {}
  }

  /* 初始化侧边栏栏 */
  iterAry = (data:any):any => {
    return data.map((el:any) => {
      if (el.children && el.children.length > 0) {
        return <Menu.SubMenu key={el.path} title={<span><Icon type={el.icon} />
          <span>{el.title}</span></span>}>
          {this.iterAry(el.children)}
        </Menu.SubMenu>
      } else {
        return <Menu.Item key={el.path} onClick={this.routerLink.bind(this, el.path)}>
          {el.icon && <Icon type={el.icon} />}
          <span>{el.title}</span>
        </Menu.Item>
      }
    })
  }

  /* 跳转路径 */
  routerLink = (path:string) => {
    this.props.history.push(path)
  }

  /** 退出 */
  loginOut = () => {
    // 退出的时候清除用户的信息
    LoggerUtil.log('首页退出', '退出好饭碗后台')
    SysUtil.clearLocalStorageAsLoginOut()
    this.props.history.push('/')
  }

  /** 面包屑的显示 */
  itemRender = (route:any, params:any, routes:any, paths:any):any => {
    const last = routes.indexOf(route) === 1
    return last ? (
      <span className="active-span" onClick={this.routerLink.bind(this, route.path)}>{route.title}</span>
    ) : (<span>{route.title}</span>)
  }

  onOpenChange = (openKeys:string[]) => {
    const { setOpenKeys } = this.props.mobxRouter
    setOpenKeys(openKeys)
  }

  changeProject = (value:string) => {
    let { setProject } = this.props.mobxCommon
    setProject(value)
  }

  /** 刷新组织的数据 */
  reloadData = () => {
    this.props.mobxCommon.setOrganize()
  }

  render () {
    const { breadcrumbAry, selectedKeys, openKeys } = this.props.mobxRouter
    let { project, projectAry } = this.props.mobxCommon
    let { minHeight } = this.state
    let admin = SysUtil.getLocalStorage(globalEnum.admin) || {}
    let { userName, userNickname, userIcon } = admin
    this.userImage = userIcon
    const menu = (
      <Menu className="menu-dropdown-parent">
        <Menu.Item onClick={this.reloadData} className="menu-dropdown-item">
          <span><Icon type="reload" /><span className="quit-span">刷新架构</span></span>
        </Menu.Item>
        <Menu.Item onClick={this.loginOut} className="menu-dropdown-item">
          <span><Icon type="logout" /><span className="quit-span">退出</span></span>
        </Menu.Item>
      </Menu>
    )
    const menuProject = (
      <Menu className="menu-dropdown-parent">
        {projectAry.map((el:any, key:number) => (
          <Menu.Item key={key}
            onClick={this.changeProject.bind(this, el.projectName)}
            className={project === el.projectName ? 'menu-dropdown-item active' : 'menu-dropdown-item'}>
            {el.projectName}
          </Menu.Item>
        ))}
      </Menu>
    )
    return (
      <Layout className="home-content ">
        <Header className="cus-header">
          <div><img src={icon}></img></div>
          <div>
            <Dropdown overlay={menuProject} className="user-project">
              <span>{project}<Icon type="down" className='icon'/></span>
            </Dropdown>
          </div>
          <div>
            <Avatar size={29} src={this.userImage || avatar} icon="user"/>
            <Dropdown overlay={menu} className="user-quit">
              <span>{userName || userNickname || '未知'}<Icon type="down" /></span>
            </Dropdown>
          </div>
        </Header>
        <Layout>
          <Sider style={{ overflow: 'auto' }}>
            <Menu mode="inline" inlineIndent={24} defaultOpenKeys={['/home/homeInfo']}
              openKeys={openKeys} onOpenChange={this.onOpenChange}
              selectedKeys={selectedKeys}>
              {this.menuItemAry}
            </Menu>
          </Sider>
          <Content>
            <Breadcrumb routes={breadcrumbAry} itemRender={this.itemRender} className="cus-breadcrumb" separator=">" />
            <div className="cus-content" style={{ minHeight: `${minHeight}px` }}>
              <CustomeRouter isFind={true} {...this.props} config={this.props.routes}/>
            </div>
          </Content>
        </Layout>
        <Version color="cus-version-color-b"/>
      </Layout>
    )
  }
}
