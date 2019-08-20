import React from 'react'
import PropTypes from 'prop-types'
import { PrimaryButton } from '../../../common'

const propTypes = {
  onClick: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired
}

const LeftBtn = ({ onClick, content }) => {
  return (
    <PrimaryButton
      inverted
      className="rup__multi-tab__tab__btn"
      onClick={onClick}
      content={content}
    />
  )
}

LeftBtn.propTypes = propTypes
export default LeftBtn
