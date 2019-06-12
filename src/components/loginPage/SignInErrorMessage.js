import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { signOutFromSSOAndSiteMinder } from '../../utils'
import { SIGN_IN_ERROR } from '../../constants/strings'
import { ErrorMessage, PrimaryButton } from '../common'

class SignInErrorMessage extends Component {
  static propTypes = {
    errorFetchingUser: PropTypes.shape({}),
    signOut: PropTypes.func.isRequired
  }

  static defaultProps = {
    errorFetchingUser: null
  }

  onLogoutBtnClick = () => {
    this.props.signOut()
    signOutFromSSOAndSiteMinder()
  }

  render() {
    const { errorFetchingUser: errResponse } = this.props

    let message = SIGN_IN_ERROR

    if (errResponse) {
      const { data, status } = errResponse
      if (data && status) {
        const { error: errorMessage } = data
        if (
          status === 403 &&
          errorMessage &&
          typeof errorMessage === 'string'
        ) {
          // read a specific error message from the server
          // it will be either the account being not active or not having a role
          message = errorMessage
        }
      }
    }

    return (
      <div className="signin__error">
        <ErrorMessage message={message} />
        <PrimaryButton
          fluid
          style={{ height: '45px', marginTop: '15px' }}
          onClick={this.onLogoutBtnClick}
          content="Sign Out"
        />
      </div>
    )
  }
}

export default SignInErrorMessage
