import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import { Loading } from '../common';
import { APP_NAME } from '../../constants/strings';
import SignInButtons from './SignInButtons';
import SignInErrorMessage from './SignInErrorMessage';

class SignInBox extends Component {
  static propTypes = {
    isFetchingUser: PropTypes.bool.isRequired,
    errorOccuredFetchingUser: PropTypes.bool.isRequired,
    errorFetchingUser: PropTypes.shape({}),
    signOut: PropTypes.func.isRequired,
  }

  static defaultProps = {
    errorFetchingUser: null,
  }

  render() {
    const {
      isFetchingUser,
      errorOccuredFetchingUser,
      errorFetchingUser,
      signOut,
    } = this.props;

    return (
      <Segment basic>
        <Loading active={isFetchingUser} />

        <div className="signin__container">
          <div className="signin__title">Sign In</div>
          <div className="signin__text1">to continue to {APP_NAME}</div>
          <div className="signin__text2">We use the BCeID for authentication.</div>
          <a
            className="signin__text3"
            href="https://portal.nrs.gov.bc.ca/web/client/bceid"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more about BCeID here.
          </a>

          {errorOccuredFetchingUser &&
            <SignInErrorMessage
              errorFetchingUser={errorFetchingUser}
              signOut={signOut}
            />
          }

          {!errorOccuredFetchingUser &&
            <SignInButtons />
          }
        </div>
      </Segment>
    );
  }
}

export default SignInBox;
