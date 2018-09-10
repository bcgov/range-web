import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Segment } from 'semantic-ui-react';
import { Loading } from './common';
import { SSO_LOGIN_ENDPOINT, SSO_IDIR_LOGIN_ENDPOINT, SSO_BCEID_LOGIN_ENDPOINT } from '../constants/API';
import { ELEMENT_ID, IMAGE_SRC } from '../constants/variables';
import { storeAuthData } from '../actions';
import { fetchUser } from '../actionCreators';
import { getIsFetchingUser } from '../reducers/rootReducer';
import { APP_NAME } from '../constants/strings';
import { detectIE } from '../utils';

const propTypes = {
  storeAuthData: PropTypes.func.isRequired,
  fetchUser: PropTypes.func.isRequired,
  isFetchingUser: PropTypes.bool.isRequired,
};

export class Login extends Component {
  // Sets up localstorage listener for cross-tab communication
  // since the authentication requires the user to be redirected
  // to another page and then redirected back to a return URL with the token.
  componentDidMount() {
    window.addEventListener('storage', this.storageEventListener);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.storageEventListener);
  }

  storageEventListener = (event) => {
    const { storeAuthData, fetchUser } = this.props;
    const authData = JSON.parse(localStorage.getItem(event.key));

    // store the auth data in Redux store
    storeAuthData(authData);

    fetchUser();
  }

  openNewTab = link => window.open(link, '_black')
  onLoginBtnClick = () => this.openNewTab(SSO_LOGIN_ENDPOINT)
  onIdirLoginBtnClick = () => this.openNewTab(SSO_IDIR_LOGIN_ENDPOINT)
  onBceidLoginBtnClick = () => this.openNewTab(SSO_BCEID_LOGIN_ENDPOINT)

  render() {
    const { isFetchingUser } = this.props;
    const isIE = detectIE();

    return (
      <section className="login">
        {isIE &&
          <article className="login__no-support-browser">
            <div className="login__no-support-browser__title">
              Your internet browser is not supported.
            </div>
            <div>
              <div>
                Please visit {APP_NAME} using a supported browser:
                <a href="https://www.google.com/chrome" target="_blank" rel="noopener noreferrer"> Google Chrome,</a>
                <a href="https://www.mozilla.org/en-US/firefox/new" target="_blank" rel="noopener noreferrer"> Firefox,</a>
                <a href="https://support.apple.com/en-ca/safari" target="_blank" rel="noopener noreferrer"> Safari </a>
                (Mac only).
              </div>
              If you choose to continue with this browser the application may not work as intended.
            </div>
          </article>
        }
        <article className="login__header">
          <img className="login__header__logo" src={IMAGE_SRC.LOGIN_LOGO} alt="Logo" />
          <div className="login__header__title">{APP_NAME}</div>
        </article>
        <article className="login__paragraph1">
          <Segment basic>
            <Loading active={isFetchingUser} />
            <div className="login__signin__container">
              <div className="login__signin__title">Sign In</div>
              <div className="login__signin__text1">to continue to {APP_NAME}</div>
              <div className="login__signin__text2">We use the BCeID for authentication.</div>
              <a
                className="login__signin__text3"
                href="https://portal.nrs.gov.bc.ca/web/client/bceid"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more about BCeID here.
              </a>
              <Button
                id={ELEMENT_ID.LOGIN_BCEID_BUTTON}
                className="login__signin__button"
                primary
                fluid
                style={{ height: '50px' }}
                onClick={this.onBceidLoginBtnClick}
              >
                Login as Agreement Holder
              </Button>
              <div className="login__signin__link-container">
                <div
                  role="button"
                  tabIndex="0"
                  onClick={this.onIdirLoginBtnClick}
                >
                  Range Staff Login
                </div>
                <div className="login__line" />
                <div
                  role="button"
                  tabIndex="0"
                  onClick={this.onLoginBtnClick}
                >
                  Admin Login
                </div>
              </div>
            </div>
          </Segment>
        </article>
        <article className="login__paragraph2">
          <div className="login__paragraph2__title">What is {APP_NAME}?</div>
          <div className="login__paragraph2__text">
            We are making it easier for you to submit and amend Range Use Plans. This new service will enable you to submit your plan electronically, save drafts and print versions.
            Your Range Officer is also getting new tools to allow so that together we can manage the land with greater accuracy.
          </div>
        </article>
        <article className="login__paragraph3">
          <div className="container">
            <div className="login__paragraph4__content">
              <div className="login__paragraph-cell">
                <hr className="login__title-spacer" />
                <div className="login__paragraph3__title">
                  New simplified Range Use Plan across BC.
                </div>
                <div className="login__paragraph3__text">
                  There is now a common Range Use Plan across BC.
                  This common plan will enable greater efficiencies in service delivery.
                </div>
              </div>
              <div className="login__paragraph-cell">
                <img
                  className="login__paragraph3__image"
                  src={IMAGE_SRC.LOGIN_PARAGRAPH3}
                  alt="paragraph3_image"
                />
              </div>
            </div>
          </div>
        </article>
        <article className="login__paragraph4">
          <div className="container">
            <div className="login__paragraph4__content">
              <div className="login__paragraph-cell">
                <img
                  className="login__paragraph4__image"
                  src={IMAGE_SRC.LOGIN_PARAGRAPH4}
                  alt="paragraph4_image"
                />
              </div>
              <div className="login__paragraph-cell">
                <hr className="login__title-spacer" />
                <div className="login__paragraph4__title">
                  Submit your Range Use Plan faster then ever.
                </div>
                <div className="login__paragraph4__text">
                  No more mail or paper. When you submit a Range Use Plan for review or amendment your Range Staff Officer can review it and you will know its status.
                </div>
              </div>
            </div>
          </div>
        </article>
        <article className="login__paragraph5">
          <div className="container">
            <div className="login__paragraph5__content">
              <div className="login__paragraph-cell">
                <hr className="login__title-spacer" />
                <div className="login__paragraph5__title">
                  Easier login with BCeID
                </div>
                <div className="login__paragraph5__text">
                  With your BCeID you can view all of your Range Use Plans and amendments. We have included ways to save time in drafting your work
                </div>
              </div>
              <div className="login__paragraph-cell">
                <img
                  className="login__paragraph5__image"
                  src={IMAGE_SRC.LOGIN_PARAGRAPH5}
                  alt="paragraph5_image"
                />
              </div>
            </div>
          </div>
        </article>
        <article className="login__paragraph6">
          <div className="container">
            <div className="login__footer">
              Copyright
              <div className="login__line" />
              Accessability
              <div className="login__line" />
              Privacy
              <div className="login__line" />
              Disclaimer
            </div>
          </div>
        </article>
      </section>
    );
  }
}

const mapStateToProps = state => (
  {
    isFetchingUser: getIsFetchingUser(state),
  }
);

Login.propTypes = propTypes;
export default connect(mapStateToProps, { storeAuthData, fetchUser })(Login);
