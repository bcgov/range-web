import React, { useEffect } from 'react';
import { PrimaryButton } from '../common';
import { ELEMENT_ID, LOCAL_STORAGE_KEY } from '../../constants/variables';
import { SSO_BCEID_LOGIN_ENDPOINT, SSO_IDIR_LOGIN_ENDPOINT } from '../../constants/api';
import { getDataFromLocalStorage as _getDataFromLocalStorage, saveDataInLocalStorage } from '../../utils';

const getDataFromLocalStorage = (key: string): any => _getDataFromLocalStorage(key);
import { generatePKCE } from '../../utils/pkceUtils';

const SignInButtons: React.FC = () => {
  const openNewTab = (link: string) => window.open(link, '_blank');

  const onSignInButtonClick = () => {
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
    openNewTab(loginEndpoint);
  };

  useEffect(() => {
    generatePKCE().then((pkce: any) => {
      saveDataInLocalStorage(LOCAL_STORAGE_KEY.AUTH_PKCE_CODE, {
        codeVerifier: pkce.codeVerifier,
        codeVerifierHash: pkce.codeVerifierHash,
      });
    });
  }, []);

  if (getDataFromLocalStorage(LOCAL_STORAGE_KEY.USER)?.ssoId?.startsWith('idir')) {
    return (
      <>
        <PrimaryButton
          id={ELEMENT_ID.LOGIN_IDIR_BUTTON}
          className="signin__button"
          fluid
          style={{ height: '45px', marginTop: '15px', marginRight: '0' }}
          onClick={onSignInButtonClick}
          content="Login using IDIR"
        />
      </>
    );
  }
  return (
    <>
      <PrimaryButton
        id={ELEMENT_ID.LOGIN_BCEID_BUTTON}
        className="signin__button"
        fluid
        style={{ height: '45px', marginTop: '15px', marginRight: '0' }}
        onClick={onSignInButtonClick}
        content="Login using BCeID"
      />
    </>
  );
};

export default SignInButtons;
