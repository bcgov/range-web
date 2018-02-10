import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login } from '../../actions/authActions';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
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
      errors, 
    } = this.state;

    return (
      <div className="login">
        <div className="title">
          MYRA APP
        </div>
        <div>
          Login
        </div>
        <div className="email">
          <label>Email</label>
          <input 
            id="email" 
            type="text" 
            placeholder="Enter Email"
            value={email}
            onChange={this.handleInput} 
          />
        </div>
        <div className="password">
          <label>Password</label>
          <input 
            id="password" 
            type="password" 
            placeholder="Enter Password"
            value={password}
            onChange={this.handleInput} 
            onKeyPress={this.handleEnter}
          />
        </div>

        <button
          onClick={this.onSubmit}
        > 
          Login
        </button>
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
