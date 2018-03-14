import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlan from './RangeUsePlan';
import { getRangeUsePlan } from '../../actions/tenureAgreementActions';

class Base extends Component {
  state = {
    id: null,
    rangeUsePlan: null,
  }
  
  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.getRangeUsePlan(id);
  }

  render() {
    const { rangeUsePlanState } = this.props;

    return (
      <div>
        <RangeUsePlan 
          rangeUsePlan={rangeUsePlanState.data}
          isLoading={rangeUsePlanState.isLoading}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rangeUsePlanState: state.rangeUsePlan
  };
};

export default connect(
  mapStateToProps, { getRangeUsePlan }
)(Base);