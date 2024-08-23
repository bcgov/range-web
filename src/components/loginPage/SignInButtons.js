import React, { Component, Fragment } from 'react';
import { PrimaryButton } from '../common';
import { ELEMENT_ID, LOCAL_STORAGE_KEY } from '../../constants/variables';
import { SSO_LOGIN_ENDPOINT, SSO_BCEID_LOGIN_ENDPOINT } from '../../constants/api';
import { saveDataInLocalStorage } from '../../utils';
import { encode as base64encode } from 'base64-arraybuffer';

class SignInButtons extends Component {
  openNewTab = (link) => window.open(link, '_blank');
  onSigninBtnClick = () => {
    this.openNewTab(SSO_LOGIN_ENDPOINT.replace('_CODE_CHALLENGE_VALUE_', this.state.codeVerifierHash));
  };
  onBceidSigninBtnClick = () => {
    this.openNewTab(SSO_BCEID_LOGIN_ENDPOINT.replace('_CODE_CHALLENGE_VALUE_', this.state.codeVerifierHash));
  };

  constructor() {
    super();
    this.state = {
      codeVerifier: null,
      codeVerifierHash: null,
      hashComputed: false,
    };
  }

  componentDidMount() {
    // generate and save new ones, and update the state
    let codeVerifier = '';

    const VALID_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    for (let i = 0; i < 128; i++) {
      codeVerifier += VALID_CHARS.charAt(Math.floor(Math.random() * VALID_CHARS.length));
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    crypto.subtle.digest('SHA-256', data).then((hash) => {
      // hash complete

      const encodedHash = base64encode(hash).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');

      this.setState({
        ...this.state,
        codeVerifier: codeVerifier,
        codeVerifierHash: encodedHash,
        hashComputed: true,
      });

      saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE, {
        codeVerifier: codeVerifier,
        codeVerifierHash: encodedHash,
      });
    });
  }

  render() {
    if (!this.state.hashComputed) {
      return <Fragment>...</Fragment>;
    }

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
        </div>
      </Fragment>
    );
  }
}

export default SignInButtons;
