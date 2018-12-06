import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { IMAGE_SRC } from '../../constants/variables';
import { storeAuthData } from '../../actions';
import { fetchUser } from '../../actionCreators';
import { getIsFetchingUser, getUserErrorMessage } from '../../reducers/rootReducer';
import { APP_NAME, LOGIN_TITLE } from '../../constants/strings';
import { detectIE } from '../../utils';
import SignInBox from './SignInBox';

export class LoginPage extends Component {
  static propTypes = {
    storeAuthData: PropTypes.func.isRequired,
    fetchUser: PropTypes.func.isRequired,
  };

  componentWillMount() {
    document.title = LOGIN_TITLE;
  }

  componentDidMount() {
    // Sets up localstorage listener for cross-tab communication
    // since the authentication requires the user to be redirected
    // to another page and then redirected back to a return URL with the token.
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

  registerBtnClicked = () => {
    window.open('https://www.bceid.ca/register/', '_blank');
  }

  render() {
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
                <a href="https://www.microsoft.com/en-ca/windows/microsoft-edge" target="_blank" rel="noopener noreferrer"> Microsoft Edge,</a>
                <a href="https://support.apple.com/en-ca/safari" target="_blank" rel="noopener noreferrer"> Safari </a>
                (Mac only).
              </div>
              If you choose to continue with this browser the application may not work as intended.
            </div>
          </article>
        }
        <article className="login__header">
          <img className="login__header__logo" src={IMAGE_SRC.NAV_LOGO} alt="Logo" />
        </article>
        <article className="login__paragraph1">
          <SignInBox
            {...this.props}
          />
        </article>
        <article className="login__paragraph2">
          <div className="login__paragraph2__title">What is {APP_NAME}?</div>
          <div className="login__paragraph2__text">
            MyRangeBC is the new home for electronic tools and information relating to crown grazing and hay-cutting activities. New tools and information will be added as they become available.
          </div>
        </article>
        <article className="login__paragraph3">
          <div className="container">
            <div className="login__paragraph4__content">
              <div className="login__paragraph-cell">
                <div className="login__paragraph3__title">
                  Simplified electronic Range Use Plan across BC
                </div>
                <div className="login__paragraph3__text">
                  After February 15, 2018 all new Range Use Plans will be submitted electronically using the new standard content requirements. Plans can be submitted, viewed, amended and printed from this site.
                </div>
              </div>
              <div className="login__paragraph-cell">
                <img
                  className="login__paragraph3__image"
                  src={IMAGE_SRC.LOGIN_PARAGRAPH3}
                  alt="paragraph3_image"
                />
                <Icon name="camera" />
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
                <Icon name="camera" />
              </div>
              <div className="login__paragraph-cell">
                <div className="login__paragraph4__title">
                  Submit your Range Use Plan faster than ever
                </div>
                <div className="login__paragraph4__text">
                  Electronic submission of new plans and amendments allows range staff and agreement holders to share content immediately. Agreement holders will be able to check the status of submissions at any time and contact the identified staff member to discuss their grazing or hay cutting operations.
                </div>
              </div>
            </div>
          </div>
        </article>
        <article className="login__paragraph5">
          <div className="container">
            <div className="login__paragraph5__content">
              <div className="login__paragraph-cell">
                <div className="login__paragraph5__title">
                  Easier login with BCeID
                </div>
                <div className="login__paragraph5__text">
                  MyRangeBC uses the secure BCeID for accessing, submitting and signing legal materials relating to crown range agreements. Many individuals may already have a  BCeID used for groundwater registration or other BC Government applications. Click below and follow the instructions to get a BCeID account.
                </div>
                <Button
                  className="login__paragraph5__register-btn"
                  primary
                  basic
                  compact
                  onClick={this.registerBtnClicked}
                >
                  Register Now
                </Button>
              </div>
              <div className="login__paragraph-cell">
                <img
                  className="login__paragraph5__image"
                  src={IMAGE_SRC.LOGIN_PARAGRAPH5}
                  alt="paragraph5_image"
                />
                <Icon name="camera" />
              </div>
            </div>
          </div>
        </article>
        <article className="login__paragraph6">
          <div className="container">
            <div className="login__footer">
              <span>Copyright</span>
              <div className="login__divider" />
              <span>Accessibility</span>
              <div className="login__divider" />
              <span>Privacy</span>
              <div className="login__divider" />
              <span>Disclaimer</span>
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
    errorFetchingUser: getUserErrorMessage(state),
  }
);

export default connect(mapStateToProps, { storeAuthData, fetchUser })(LoginPage);
