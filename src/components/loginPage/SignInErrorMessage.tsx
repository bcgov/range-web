import React from 'react';
import { signOutFromSSOAndSiteMinder } from '../../utils';
import { SIGN_IN_ERROR } from '../../constants/strings';
import { ErrorMessage, PrimaryButton } from '../common';

interface SignInErrorMessageProps {
  errorFetchingUser: any;
  signOut: () => void;
}

function SignInErrorMessage({ errorFetchingUser: errResponse, signOut }: SignInErrorMessageProps) {
  const onLogoutBtnClick = () => {
    signOut();
    signOutFromSSOAndSiteMinder();
  };

  let message: string = SIGN_IN_ERROR;

  if (errResponse) {
    const { data, status } = errResponse;
    if (data && status) {
      const { error: errorMessage } = data;
      if (status === 403 && errorMessage && typeof errorMessage === 'string') {
        message = errorMessage;
      }
    }
  }

  return (
    <div className="signin__error">
      <ErrorMessage message={message} />
      <PrimaryButton
        fluid
        style={{ height: '45px', marginTop: '15px' }}
        onClick={onLogoutBtnClick}
        content="Sign Out"
      />
    </div>
  );
}

export default SignInErrorMessage;
