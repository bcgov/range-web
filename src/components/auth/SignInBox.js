import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Segment, Button, Message, Icon } from 'semantic-ui-react';
import { Loading } from '../common';
import { SSO_LOGIN_ENDPOINT, SSO_IDIR_LOGIN_ENDPOINT, SSO_BCEID_LOGIN_ENDPOINT } from '../../constants/api';
import { ELEMENT_ID } from '../../constants/variables';
import { APP_NAME } from '../../constants/strings';
import { signOutFromSSO } from '../../utils';

class SignInBox extends Component {
  static propTypes = {
    isFetchingUser: PropTypes.bool.isRequired,
    errorFetchingUser: PropTypes.shape({}),
    signOut: PropTypes.func.isRequired,
  }

  static defaultProps = {
    errorFetchingUser: null,
  }

  openNewTab = link => window.open(link, '_black')
  onSigninBtnClick = () => this.openNewTab(SSO_LOGIN_ENDPOINT)
  onIdirSigninBtnClick = () => this.openNewTab(SSO_IDIR_LOGIN_ENDPOINT)
  onBceidSigninBtnClick = () => this.openNewTab(SSO_BCEID_LOGIN_ENDPOINT)

  onLogoutBtnClick = () => {
    this.props.signOut();
    signOutFromSSO();
  }

  renderErrorOccur = (errResponse) => {
    let message = 'Error occured while signing in.';
    if (errResponse) {
      const { data, status } = errResponse;
      if (data && status) {
        const { error: errorMessage } = data;
        if (status === 403 && errorMessage && typeof errorMessage === 'string') {
          // read a specific error message from the server
          message = errorMessage;
        }
      }
    }

    return (
      <div className="signin__error">
        <Message error>
          <Message.Content>
            <Icon name="warning sign" style={{ marginRight: '5px' }} />
            {message}
          </Message.Content>
        </Message>
        <Button
          primary
          fluid
          style={{ height: '50px', marginTop: '15px' }}
          onClick={this.onLogoutBtnClick}
        >
          Sign Out
        </Button>
      </div>
    );
  }

  render() {
    const { isFetchingUser, errorFetchingUser } = this.props;

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

          {errorFetchingUser &&
            this.renderErrorOccur(errorFetchingUser)
          }

          {!errorFetchingUser &&
            <Fragment>
              <Button
                id={ELEMENT_ID.LOGIN_BCEID_BUTTON}
                className="signin__button"
                primary
                fluid
                style={{ height: '50px', marginTop: '15px' }}
                onClick={this.onBceidSigninBtnClick}
              >
                Login as Agreement Holder
              </Button>
              <div className="signin__link-container">
                <div
                  role="button"
                  tabIndex="0"
                  onClick={this.onIdirSigninBtnClick}
                >
                  Range Staff Login
                </div>
                <div className="signin__divider" />
                <div
                  role="button"
                  tabIndex="0"
                  onClick={this.onSigninBtnClick}
                >
                  Admin Login
                </div>
              </div>
            </Fragment>
          }
        </div>
      </Segment>
    );
  }
}

export default SignInBox;
