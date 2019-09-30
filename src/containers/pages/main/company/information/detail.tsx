/**
 * @author minjie
 * @createTime 2019/07/12
 * @description 资讯详情
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Row, Col, Form, Button } from 'antd'
import { BaseProps } from 'typings/global'

import { InformationInfoDetail } from './components/info'

import 'braft-editor/dist/output.css'
import './style/editoradd.styl'

const layoutFrom = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

interface InfamationDetailProps extends BaseProps {
}

interface InfamationDetailState {
  infoId: number
  // 详细信息
  informationInfo: InformationInfoDetail
}

export default class InfamationDetail extends RootComponent<InfamationDetailProps, InfamationDetailState> {
  constructor (props:InfamationDetailProps) {
    super(props)
    const { infoId } = this.props.match.params
    this.state = {
      infoId,
      informationInfo: new InformationInfoDetail()
    }
  }

  componentDidMount () {
    const { infoId } = this.state
    if (infoId) {
      // 查询详情
      this.getDetail(infoId)
    }
  }

  goBack = () => {
    this.props.history.push('/home/company/information')
  }

  /** 查询详情 */
  getDetail = (infoId:number) => {
    this.axios.request(this.api.informationDetail, { infoId }).then((res:any) => {
      const { data } = res
      this.setState({ informationInfo: data })
    }).catch((err:any) => {
      console.log(err)
    })
  }

  render () {
    const { infoCollectionVolume, infoContent, infoForwardingVolume, infoPointPraise,
      infoReadingVolume, infoState, infoTitle } = this.state.informationInfo
    return (
      <div className='cus-home-content'>
        <Form {...layoutFrom}>
          <Row>
            <Col span={6}><Form.Item label='阅读量'>{infoReadingVolume}</Form.Item></Col>
            <Col span={6}><Form.Item label='点赞量'>{infoPointPraise}</Form.Item></Col>
            <Col span={6}><Form.Item label='转发量'>{infoForwardingVolume}</Form.Item></Col>
            <Col span={6}><Form.Item label='收藏量'>{infoCollectionVolume}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={6}><Form.Item label='状态'>{infoState}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={6}><Form.Item label='文章标题'>{infoTitle}</Form.Item></Col>
          </Row>
          <Row>
            <Col span={18}>
              <Form.Item labelCol={{ span: 2 }} wrapperCol={{ span: 22 }} label='文章全文'>
                <div className='braft-output-content'
                  dangerouslySetInnerHTML={{ __html: infoContent || '' }}></div>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={6}>
              <Form.Item wrapperCol={{ span: 18, offset: 6 }}>
                <Button htmlType="button" onClick={this.goBack}>返回</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}
