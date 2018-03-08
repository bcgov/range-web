import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlan from './RangeUsePlan';

class Base extends Component {
  render() {
    return (
      <RangeUsePlan {...this.props} />
    );
  }
}

const mapStateToProps = state => {
  return {

  }; 
};

export default connect(
  mapStateToProps, null
)(Base);