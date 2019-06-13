import React, { Component, Fragment } from 'react'
import { PrimaryButton } from '../common'
import { ELEMENT_ID } from '../../constants/variables'
import {
  SSO_LOGIN_ENDPOINT,
  SSO_IDIR_LOGIN_ENDPOINT,
  SSO_BCEID_LOGIN_ENDPOINT
} from '../../constants/api'

class SignInButtons extends Component {
  openNewTab = link => window.open(link, '_blank')
  onSigninBtnClick = () => this.openNewTab(SSO_LOGIN_ENDPOINT)
  onIdirSigninBtnClick = () => this.openNewTab(SSO_IDIR_LOGIN_ENDPOINT)
  onBceidSigninBtnClick = () => this.openNewTab(SSO_BCEID_LOGIN_ENDPOINT)

  render() {
    return (
      <Fragment>
        <PrimaryButton
          id={ELEMENT_ID.LOGIN_BCEID_BUTTON}
          className="signin__button"
          fluid
          style={{ height: '45px', marginTop: '15px', marginRight: '0' }}
          onClick={this.onBceidSigninBtnClick}
          content="Login as an Agreement Holder"
        />
        <div className="signin__link-container">
          <div role="button" tabIndex="0" onClick={this.onSigninBtnClick}>
            Range Staff Login
          </div>
          {/* <div className="signin__divider" />
          <div
            role="button"
            tabIndex="0"
            onClick={this.onSigninBtnClick}
          >
            Admin Login
          </div> */}
        </div>
      </Fragment>
    )
  }
}

export default SignInButtons
