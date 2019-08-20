import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import RightBtn from '../tab/RightBtn'

class LastTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      text1: PropTypes.string.isRequired,
      text2: PropTypes.string
    }).isRequired
  }

  render() {
    const { currTabId, tab, onClose } = this.props
    const { id, title, text1, text2 } = tab
    const isActive = id === currTabId

    if (!isActive) {
      return null
    }

    return (
      <div className="rup__multi-tab__last">
        <Icon
          style={{ marginBottom: '10px' }}
          name="check circle outline"
          size="huge"
          color="green"
        />
        <div className="rup__multi-tab__last__title">{title}</div>
        <div style={{ marginBottom: '20px' }}>{text1}</div>
        {text2 && <div style={{ marginBottom: '20px' }}>{text2}</div>}
        <RightBtn primary onClick={onClose} content="Ok" />
      </div>
    )
  }
}

export default LastTab
