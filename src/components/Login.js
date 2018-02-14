import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { login } from '../actions/authActions';

export class Login extends Component {
  state = {
    username: '',
    password: '',
  }
  
  isInputsValid() {
    return true;  
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { ...requestData } = this.state;

    if (this.isInputsValid()) {
      this.props.login({ ...requestData });
    }
  }

  handleInput = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    const { 
      username, 
      password, 
    } = this.state;

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

        <div className="login__header">
          Login
        </div>

        <Form loading={loginState.isLoading || false}>
          <div className="login__form">
            <Form.Field>
              <label>Username</label>
              <input 
                id="username" 
                type="text" 
                placeholder="Enter Username"
                value={username}
                onChange={this.handleInput} 
              />
            </Form.Field>
          </div>

          <div className="login__form">
            <Form.Field>
              <label>Password</label>
              <input 
                id="password" 
                type="password" 
                placeholder="Enter Password"
                value={password}
                onChange={this.handleInput} 
                onKeyPress={this.handleEnter}
              />
            </Form.Field>  
          </div>

          <div className="login__button">
            <Button
              onClick={this.onSubmit}
              primary
              fluid
            > 
              Login
            </Button>
          </div>
        </Form>
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
