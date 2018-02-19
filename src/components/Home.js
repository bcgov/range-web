import React, { Component } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/authActions';
import RangeUsePlanPage from './rangeUsePlan/RangeUsePlanPage';

class Home extends Component {
  onLogout = (e) => {
    this.props.logout();
  }
  
  render() {
    return (
      <div> 
       <RangeUsePlanPage />
    
        Home
        <button
          onClick={this.onLogout}
        >
          Logout
        </button>

      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.authReducer;
  
  return {
    user
  };  
};

export default connect (
  mapStateToProps, { logout }
)(Home)
