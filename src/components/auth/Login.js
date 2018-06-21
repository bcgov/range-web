import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

import { parseQuery } from '../../handlers';
import { SSO_LOGIN_ENDPOINT, SSO_IDIR_LOGIN_ENDPOINT, SSO_BCEID_LOGIN_ENDPOINT } from '../../constants/api';
import { LOGIN_LOGO_SRC, LOGIN_BUTTON_ELEMENT_ID } from '../../constants/variables';
import { login } from '../../actions/authActions';

const propTypes = {
  login: PropTypes.func.isRequired,
  location: PropTypes.shape({}).isRequired,
  loginState: PropTypes.shape({}).isRequired,
};

export class Login extends Component {
  componentDidMount() {
    const { login, location } = this.props;

    // grab the code from the redirect url
    const { code } = parseQuery(location.search);

    if (code) {
      login(code);
    }
  }

  onLoginBtnClick = () => {
    window.open(SSO_LOGIN_ENDPOINT, '_self');
  }

  onIdirLoginBtnClick = () => {
    window.open(SSO_IDIR_LOGIN_ENDPOINT, '_self');
  }

  onBceidLoginBtnClick = () => {
    window.open(SSO_BCEID_LOGIN_ENDPOINT, '_self');
  }

  render() {
    const {
      loginState,
    } = this.props;

    return (
      <div className="login">
        <img
          className="login__image"
          src={LOGIN_LOGO_SRC}
          alt="login-img"
        />

        <div className="login__title">
          My Range Application
        </div>

        <div className="login__button">
          <Button
            id={LOGIN_BUTTON_ELEMENT_ID}
            loading={loginState.isLoading || false}
            disabled={loginState.isLoading || false}
            primary
            fluid
            onClick={this.onLoginBtnClick}
          >
            Login
          </Button>

          <Button
            // id={LOGIN_BUTTON_ELEMENT_ID}
            style={{ marginTop: '15px' }}
            loading={loginState.isLoading || false}
            disabled={loginState.isLoading || false}
            primary
            fluid
            onClick={this.onIdirLoginBtnClick}
          >
            Login as Range Staff
          </Button>

          <Button
            // id={LOGIN_BUTTON_ELEMENT_ID}
            style={{ marginTop: '15px' }}
            loading={loginState.isLoading || false}
            disabled={loginState.isLoading || false}
            primary
            fluid
            onClick={this.onBceidLoginBtnClick}
          >
            Login as Agreement Holder
          </Button>
        </div>
        <a
          className="login__change-link"
          href="https://summer.gov.bc.ca"
          target="_blank"
          rel="noopener noreferrer"
        >
          Is your password expired?
        </a>
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    loginState: state.auth,
  }
);

Login.propTypes = propTypes;
export default connect(mapStateToProps, { login })(Login);

