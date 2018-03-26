import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlan from './RangeUsePlan';
import { Loading } from '../common';
import { getRangeUsePlan } from '../../actions/tenureAgreementActions';
import { updateRupStatus } from '../../actions/rangeUsePlanActions';
import { AGREEMENT_STATUS } from '../../constants/variables';

class Base extends Component {
  state = {
    id: null,
    rangeUsePlan: null,
  }
  
  componentDidMount() {
    const { getRangeUsePlan, match } = this.props;
    const { id } = match.params;
    getRangeUsePlan(id);
  }

  render() {
    const { 
      references,
      rangeUsePlanState,
      updateRupStatus,
      isUpdatingStatus,
    } = this.props;
    const { data: rangeUsePlan, isLoading, success } = rangeUsePlanState;
    const statuses = references[AGREEMENT_STATUS];

    return (
      <div>
        { isLoading &&
          <Loading />
        }
        { success && 
          <RangeUsePlan 
            rangeUsePlan={rangeUsePlan}
            statuses={statuses}
            updateRupStatus={updateRupStatus}
            isUpdatingStatus={isUpdatingStatus}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    rangeUsePlanState: state.rangeUsePlan,
    references: state.references.data,
    isUpdatingStatus: state.updateRupStatus.isLoading,
  };
};

export default connect(
  mapStateToProps, { getRangeUsePlan, updateRupStatus }
)(Base);