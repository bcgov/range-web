import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'

class TabTemplate extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    actions: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    isActive: PropTypes.bool.isRequired
  }

  render() {
    const { title, actions, content, isActive } = this.props

    return (
      <div
        className={classnames('rup__multi-tab', {
          'rup__multi-tab--active': isActive
        })}>
        <div className="rup__multi-tab__title">{title}</div>
        {content}
        <div className="rup__multi-tab__btns">{actions}</div>
      </div>
    )
  }
}

export default TabTemplate
