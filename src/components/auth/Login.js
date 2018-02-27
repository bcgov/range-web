import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import queryString from 'query-string';

import { SSO_AUTH_ENDPOINT } from '../../constants/api';
import { login } from '../../actions/authActions';

export class Login extends Component {
  state = {

  }

  componentDidMount() {
    const { login, location } = this.props;
    
    // grab the code from the redirect url
    const parsed = queryString.parse(location.search);
    const { code } = parsed;

    if(code) {
      login(code)
    }
  }

  onButtonClick = (e) => {
    // const width = 900;
    // const height = 500;
    // const top = window.outerHeight/2 - height/2;
    // const left = window.outerWidth/2 - width/2;
    // const parameter = `width=${width}, height=${height}, top=${top}, left=${left}`;
    // window.open(SSO_AUTH_ENDPOINT, "_blank", parameter);

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
          My Range Application
        </div>

        {/* <div className="login__header">
          Login
        </div> */}

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
    loginState: state.authReducer,
  }; 
};

export default connect (
  mapStateToProps, { login }
)(Login)
