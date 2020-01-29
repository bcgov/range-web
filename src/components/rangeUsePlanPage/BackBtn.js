import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import { useHistory } from 'react-router-dom'
import { HOME } from '../../constants/routes'

const BackBtn = ({ className = '', agreementId }) => {
  const history = useHistory()

  const { page = 1 } = history.location.state || {}

  return (
    <div
      className={className}
      onClick={() => history.push(`${HOME}/${page}?selected=${agreementId}`)}
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
