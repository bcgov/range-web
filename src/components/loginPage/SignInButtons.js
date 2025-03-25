import React, { Component, Fragment } from 'react';
import { PrimaryButton } from '../common';
import { ELEMENT_ID, LOCAL_STORAGE_KEY } from '../../constants/variables';
import { SSO_BCEID_LOGIN_ENDPOINT, SSO_IDIR_LOGIN_ENDPOINT } from '../../constants/api';
import { getDataFromLocalStorage, saveDataInLocalStorage } from '../../utils';
import { generatePKCE } from '../../utils/pkceUtils';

class SignInButtons extends Component {
  openNewTab = (link) => window.open(link, '_blank');

  onSignInButtonClick = () => {
    let loginEndpoint = SSO_BCEID_LOGIN_ENDPOINT.replace(
      '_CODE_CHALLENGE_VALUE_',
      getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE).codeVerifierHash,
    );
    if (getDataFromLocalStorage(LOCAL_STORAGE_KEY.USER)?.ssoId?.startsWith('idir')) {
      loginEndpoint = SSO_IDIR_LOGIN_ENDPOINT.replace(
        '_CODE_CHALLENGE_VALUE_',
        getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE).codeVerifierHash,
      );
    }
    this.openNewTab(loginEndpoint);
  };

  componentDidMount() {
    generatePKCE().then((pkce) => {
      saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE, {
        codeVerifier: pkce.codeVerifier,
        codeVerifierHash: pkce.codeVerifierHash,
      });
    });
  }

  render() {
    if (getDataFromLocalStorage(LOCAL_STORAGE_KEY.USER)?.ssoId?.startsWith('idir')) {
      return (
        <Fragment>
          <PrimaryButton
            id={ELEMENT_ID.LOGIN_IDIR_BUTTON}
            className="signin__button"
            fluid
            style={{ height: '45px', marginTop: '15px', marginRight: '0' }}
            onClick={this.onSignInButtonClick}
            content="Login using IDIR"
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <PrimaryButton
          id={ELEMENT_ID.LOGIN_BCEID_BUTTON}
          className="signin__button"
          fluid
          style={{ height: '45px', marginTop: '15px', marginRight: '0' }}
          onClick={this.onSignInButtonClick}
          content="Login using BCeID"
        />
      </Fragment>
    );
  }
}

export default SignInButtons;
