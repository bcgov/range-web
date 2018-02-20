import React, { Component } from 'react';
import { connect } from 'react-redux';

import TenureAgreement from './tenureAgreement/TenureAgreement';

class Home extends Component {
  render() {
    return (
      <div> 
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
