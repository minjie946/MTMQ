/**
 * @description 在招岗位标签
 * @author minjie
 * @createTime 2019/06/15
 * @copyright Copyright © 2019 Shanghai Yejia Digital Technology Co., Ltd. All rights reserved.
 */
import * as React from 'react'
import { RootComponent } from '@components/index'
import { Form, Tag, Input, Icon, Tooltip, Row, Col } from 'antd'
import { FormComponentProps } from 'antd/lib/form'

import { JudgeUtil } from '@utils/index'

import '../style/index.styl'

interface LableItemProps extends FormComponentProps {
  onChange?: Function
  value?:any
}

interface LableItemState {
  tags: Array<string>
  inputVisible: boolean
  inputValue: string
}

class LableItem extends RootComponent<LableItemProps, LableItemState> {
  constructor (props:LableItemProps) {
    super(props)
    let tags = props.value || []
    this.state = {
      tags,
      inputVisible: false,
      inputValue: ''
    }
  }

  static getDerivedStateFromProps (props:any, state:any) {
    if (state.tags.length === 0) {
      state.tags = props.value || state.tags || []
    }
    return state
  }

  // 输入框的事件
  input:any = React.createRef()

  /** 删除一个标签 */
  handleClose = (removedTag:any) => {
    const tags = this.state.tags.filter(tag => tag !== removedTag)
    this.changgValue(tags)
    this.setState({ tags })
  }

  /** 显示输入框 */
  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus())
  }

  /** 输入框值改变 */
  handleInputChange = (e:any) => {
    let value = e.target.value
    this.setState({ inputValue: value })
  }

  /** 输入完后之后 回车 */
  handleInputConfirm = () => {
    const { inputValue } = this.state
    let { tags } = this.state
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue]
    }
    this.changgValue(tags)
    this.setState({
      tags,
      inputVisible: false,
      inputValue: ''
    })
  }
  /** 值改变的时候 */
  changgValue = (tags:Array<string>) => {
    const { onChange } = this.props
    if (onChange) onChange(tags)
  }

  saveInputRef = (input:any) => (this.input = input)

  render () {
    const { tags, inputVisible, inputValue } = this.state
    return (
      <div>
        <Row>
          {tags.map((tag, index:number) => {
            const isLongTag = tag.length > 4
            const tagElem = (
              <Col span={6} key={index}>
                <Tag className='cus-recru-lable-item' key={tag} closable onClose={() => this.handleClose(tag)}>
                  {isLongTag ? `${tag.slice(0, 4)}...` : tag}
                </Tag>
              </Col>
            )
            return isLongTag ? (
              <Tooltip title={tag} key={tag}>
                {tagElem}
              </Tooltip>
            ) : (
              tagElem
            )
          })}
          <Col span={6}>
            {inputVisible && (
              <Input
                ref={this.saveInputRef}
                type="text"
                size="small"
                maxLength={10}
                style={{ width: 80 }}
                value={inputValue}
                onChange={this.handleInputChange}
                onBlur={this.handleInputConfirm}
                onPressEnter={this.handleInputConfirm}
              />
            )}
            {!inputVisible && tags.length < 8 && <Tag className='cus-recru-lable-item' onClick={this.showInput}><Icon type="plus" /></Tag>}
          </Col>
        </Row>
      </div>
    )
  }
}

export default Form.create<LableItemProps>()(LableItem)
