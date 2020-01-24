import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'

const BackBtn = ({ className = '' }) => {
  const history = useHistory()

  return (
    <div
      className={className}
      onClick={() => history.goBack()}
      role="button"
      tabIndex="0">
      <Icon name="arrow circle left" size="large" />
    </div>
  )
}

BackBtn.propTypes = {
  agreementSearchParams: PropTypes.shape({}),
  className: PropTypes.string
}

export default BackBtn
