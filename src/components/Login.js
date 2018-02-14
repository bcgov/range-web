import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Button } from 'semantic-ui-react';

import { login } from '../actions/authActions';

export class Login extends Component {
  state = {
    email: '',
    password: '',
  }
  
  validateInputs() {
    return false;  
  }

  onSubmit = (e) => {
    e.preventDefault();
    if (this.validateInputs()) {
      return;
    }
    this.props.login({...this.state});
  }

  handleInput = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    });
  }

  render() {
    const { 
      email, 
      password, 
    } = this.state;

    return (
      <div className="login">
        <div className="login__title">
          My Range Application
        </div>

        <div className="login__header">
          Login
        </div>

        <Form>
          <div className="login__form">
            <Form.Field>
              <label>Username</label>
              <input 
                id="email" 
                type="text" 
                placeholder="Enter Email"
                value={email}
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
    loginIsFetching: state.authReducer.isFetching,
    loginSuccess: state.authReducer.success
  }; 
};

export default connect (
  mapStateToProps, { login }
)(Login)
