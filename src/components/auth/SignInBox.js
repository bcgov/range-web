import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';
import { Loading } from '../common';
import { APP_NAME } from '../../constants/strings';
import { LOCAL_STORAGE_KEY } from '../../constants/variables';
import { getDataFromLocalStorage } from '../../utils';
import { fetchUser, signOut, resetTimeoutForReAuth } from '../../actionCreators';
import { storeAuthData, reauthenticate } from '../../actions';
import { getIsFetchingUser, getUserErrorResponse, getUserErrorOccured } from '../../reducers/rootReducer';
import SignInButtons from './SignInButtons';
import SignInErrorMessage from './SignInErrorMessage';

class SignInBox extends Component {
  static propTypes = {
    isFetchingUser: PropTypes.bool.isRequired,
    errorOccuredFetchingUser: PropTypes.bool.isRequired,
    errorFetchingUser: PropTypes.shape({}),
    signOut: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
    storeAuthData: PropTypes.func.isRequired,
    resetTimeoutForReAuth: PropTypes.func.isRequired,
    reauthenticate: PropTypes.func.isRequired,
  }

  static defaultProps = {
    errorFetchingUser: null,
  }

  componentDidMount() {
    // Sets up localstorage listener for cross-tab communication
    // since the authentication requires the user to be redirected to a new tab
    // and then redirected back to a return URL(land in ReturnPage.js) with the token.
    window.addEventListener('storage', this.storageEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageEventListener);
  }

  storageEventListener = () => {
    const { storeAuthData, fetchUser, resetTimeoutForReAuth, reauthenticate } = this.props;
    const authData = getDataFromLocalStorage(LOCAL_STORAGE_KEY.AUTH);

    if (authData) {
      storeAuthData(authData); // store the auth data in Redux store
      resetTimeoutForReAuth(reauthenticate);
      fetchUser();
    }
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

const mapStateToProps = state => (
  {
    isFetchingUser: getIsFetchingUser(state),
    errorFetchingUser: getUserErrorResponse(state),
    errorOccuredFetchingUser: getUserErrorOccured(state),
  }
);

export default connect(mapStateToProps, {
  fetchUser,
  storeAuthData,
  signOut,
  reauthenticate,
  resetTimeoutForReAuth,
})(SignInBox);
