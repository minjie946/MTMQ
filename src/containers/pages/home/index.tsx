/**
 * @author minjie
 * @createTime 2019/10/14
 * @description 主界面
 * @copyright minjie<15181482629@163.com>
 */
import * as React from 'react'
import { RootComponent, RouterMoudel, SilderInterface, BreadcrumbAryInteface } from '@components/index'
import { Menu, Icon, Layout, Breadcrumb } from 'antd'
import { SysUtil } from '@utils/index'
import { BaseProps } from 'typings/global'
import './index.styl'

const { Header, Content, Sider, Footer } = Layout

interface HomeProps extends BaseProps {
}

interface HomeState {
}

export default class Home extends RootComponent<HomeProps, HomeState> {
  constructor (props:any) {
    super(props)
    this.state = {}
  }

  breadcrumbAry:Array<any> = []

  onBreadcrumb = (breadcrumbAry:Array<BreadcrumbAryInteface>) => {
    this.breadcrumbAry = breadcrumbAry
  }

  /* 初始化侧边栏栏 */
  iterAry = (data:Array<SilderInterface>):any => {
    return data.map((el:any) => {
      if (el.children && el.children.length > 0) {
        return <Menu.SubMenu key={el.path} title={<span>{el.icon && <Icon type={el.icon} />}
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
    const { history } = this.props
    if (history) history.push(path)
  }

  /** 面包屑的显示 */
  itemRender = (route:any, params:any, routes:any, paths:any):any => {
    const last = routes.indexOf(route) === 1
    return last ? (
      <span className="active-span" onClick={this.routerLink.bind(this, route.path)}>{route.title}</span>
    ) : (<span>{route.title}</span>)
  }

  render () {
    const { routes } = this.props
    const silderAry:Array<SilderInterface> = SysUtil.getSessionStorage('silderAry')
    return (
      <Layout id='home-container'>
        <Header className='header'>
          <div className="logo" />
        </Header>
        <Layout>
          <Sider style={{ overflow: 'auto' }}>
            <Menu mode="inline" inlineIndent={24} openKeys={['/home/basic']} defaultOpenKeys={['/home/basic/table']}>
              {this.iterAry(silderAry)}
            </Menu>
          </Sider>
          <Layout>
            <Content>
              <Breadcrumb routes={this.breadcrumbAry} itemRender={this.itemRender} className="breadcrumb" separator=">" />
              <div className='content'>
                <RouterMoudel {...this.props} onBreadcrumb={this.onBreadcrumb} routes={routes}/>
              </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>minjie 15181482629@163.com</Footer>
          </Layout>
        </Layout>
      </Layout>
    )
  }
}
