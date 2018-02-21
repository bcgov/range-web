import React, { Component } from 'react';
import { connect } from 'react-redux';

import TenureAgreement from './tenureAgreement';

class Home extends Component {
  render() {
    return (
      <div className="home"> 
       <TenureAgreement />
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
  mapStateToProps, null
)(Home)
