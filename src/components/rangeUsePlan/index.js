import React, { Component } from 'react';
import { connect } from 'react-redux';
import RangeUsePlan from './RangeUsePlan';
import { getRangeUsePlan } from '../../actions/tenureAgreementActions';
import { Form as Loading } from 'semantic-ui-react';
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
    const { references, rangeUsePlanState } = this.props;
    const { data, isLoading } = rangeUsePlanState;
    const rangeUsePlan = data;
    const status = references[AGREEMENT_STATUS];

    return (
      <Loading loading={isLoading}>
        <RangeUsePlan 
          rangeUsePlan={rangeUsePlan}
          status={status}
        />
      </Loading>
    );
  }
}

const mapStateToProps = state => {
  return {
    rangeUsePlanState: state.rangeUsePlan,
    references: state.references.data
  };
};

export default connect(
  mapStateToProps, { getRangeUsePlan }
)(Base);