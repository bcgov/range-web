import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'
import { PrimaryButton } from './index'

const propTypes = {
  message: PropTypes.string.isRequired
}

const ErrorPage = ({ message }) => {
  return (
    <div className="error-page">
      <Icon name="warning circle" size="big" color="red" />
      <div>
        <span className="error-page__message">{message}</span>
      </div>
      <div>
        <PrimaryButton
          onClick={() => window.location.reload(true)}
          content="Reload"
        />
      </div>
    </div>
  )
}

ErrorPage.propTypes = propTypes
export default ErrorPage
