import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlan from './RangeUsePlan';
import { Loading } from '../common';
import { getRangeUsePlan } from '../../actions/agreementActions';
import { updateRupStatus } from '../../actions/rangeUsePlanActions';
import { PLAN_STATUS } from '../../constants/variables';

class Base extends Component {
  componentDidMount() {
    const { getRangeUsePlan, match } = this.props;
    const { agreementId } = match.params;
    getRangeUsePlan(agreementId);
  }

  render() {
    const {
      references,
      agreementState,
      updateRupStatus,
      isUpdatingStatus,
    } = this.props;
    const { data: agreement, isLoading, success } = agreementState;
    const statuses = references[PLAN_STATUS];

    return (
      <div>
        { isLoading &&
          <Loading />
        }
        { success &&
          <RangeUsePlan
            agreement={agreement}
            statuses={statuses}
            updateRupStatus={updateRupStatus}
            isUpdatingStatus={isUpdatingStatus}
          />
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    agreementState: state.rangeUsePlan,
    references: state.references.data,
    isUpdatingStatus: state.updateRupStatus.isLoading,
  }
);

export default connect(mapStateToProps, { getRangeUsePlan, updateRupStatus })(Base);
