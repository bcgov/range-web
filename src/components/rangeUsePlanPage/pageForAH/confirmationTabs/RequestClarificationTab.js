import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import RightBtn from '../tab/RightBtn'
import LeftBtn from '../tab/LeftBtn'
import TabTemplate from '../tab/TabTemplate'

class RequestClarificationTab extends Component {
  static propTypes = {
    currTabId: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    tab: PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
      back: PropTypes.string,
      text1: PropTypes.string,
      text2: PropTypes.string
    }).isRequired
  }

  onBackClicked = e => {
    const { handleTabChange, tab } = this.props

    handleTabChange(e, { value: tab.back })
  }

  render() {
    const { currTabId, tab, onClose } = this.props
    const { id, title, text1, text2 } = tab
    const isActive = id === currTabId

    if (!isActive) {
      return null
    }

    return (
      <TabTemplate
        isActive={isActive}
        title={title}
        actions={
          <Fragment>
            <LeftBtn onClick={this.onBackClicked} content="Back" />
            <RightBtn onClick={onClose} content="Close" />
          </Fragment>
        }
        content={
          <Fragment>
            <div className="rup__confirmation__request__header">
              Your approval has not been submitted.
            </div>
            <div style={{ marginBottom: '20px' }}>{text1}</div>
            <div style={{ marginBottom: '20px' }}>{text2}</div>
          </Fragment>
        }
      />
    )
  }
}

export default RequestClarificationTab
