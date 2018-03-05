import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlans from './RangeUsePlans';
import { getRangeUsePlans, searchRangeUsePlans } from '../../actions/rangeUsePlanActions';

const mapStateToProps = state => {
  return {
    rangeUsePlanState: state.rangeUsePlanReducer,
  };
};

export default connect(
  mapStateToProps, { getRangeUsePlans, searchRangeUsePlans }
)(
  class extends Component {
    componentDidMount() {
      this.props.getRangeUsePlans();
    }

    render() {
      return (
        <RangeUsePlans {...this.props} />
      );
    }
  }
);

