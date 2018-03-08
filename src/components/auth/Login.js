import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import queryString from 'query-string';

import { SSO_AUTH_ENDPOINT } from '../../constants/api';
import { login } from '../../actions/authActions';


const propTypes = {
  location: PropTypes.object.isRequired,
  login: PropTypes.func.isRequired,
  loginState: PropTypes.object.isRequired,
};

export class Login extends Component {
  componentDidMount() {
    const { login, location } = this.props;

    // grab the code from the redirect url
    const parsed = queryString.parse(location.search);
    const { code } = parsed;

    if(code) {
      login(code)
    }
  }

  onButtonClick = () => {
    window.open(SSO_AUTH_ENDPOINT, "_self");
  }

  render() {
    const {
      loginState
    } = this.props;

    return (
      <div className="login">
        <img
          className="login__image" 
          src="https://avatars3.githubusercontent.com/u/916280?s=200&v=4" 
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

const mapStateToProps = state => {
  return {
    loginState: state.auth,
  }; 
};

Login.propTypes = propTypes;
export default connect (
  mapStateToProps, { login }
)(Login)
