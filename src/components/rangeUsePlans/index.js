import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlans from './RangeUsePlans';
import { getRangeUsePlans } from '../../actions/rangeUsePlanActions';

class Base extends Component {
  componentDidMount() {
    this.props.getRangeUsePlans();
  }

  render() {
    return (
      <RangeUsePlans {...this.props} />
    );
  }
}

const mapStateToProps = state => {
  return {
    rangeUsePlanState: state.getRangeUsePlans
  };
};

export default connect(
  mapStateToProps, { getRangeUsePlans }
)(Base);