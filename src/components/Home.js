import React, { Component } from 'react';
import { connect } from 'react-redux';

import RangeUsePlanPage from './rangeUsePlan/RangeUsePlanPage';

class Home extends Component {
  render() {
    return (
      <div> 
       <RangeUsePlanPage />
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
