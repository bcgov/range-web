import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import queryString from 'query-string';

import { SSO_AUTH_ENDPOINT } from '../../constants/api';
import { LOGIN_LOGO_SRC } from '../../constants/variables';
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
    const parsed = queryString.parse(location.search);
    const { code } = parsed;

    if (code) {
      login(code);
    }
  }

  onButtonClick = () => {
    window.open(SSO_AUTH_ENDPOINT, '_self');
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
          alt="gov-img"
        />

        <div className="login__title">
          My Range App
        </div>

        <div className="login__button">
          <Button
            id="login-button"
            loading={loginState.isLoading || false}
            disabled={loginState.isLoading || false}
            primary
            fluid
            onClick={this.onButtonClick}
          >
            Login
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

