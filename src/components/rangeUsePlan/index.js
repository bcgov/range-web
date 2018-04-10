import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import RangeUsePlan from './RangeUsePlan';
import { Loading } from '../common';
import { getRangeUsePlan } from '../../actions/agreementActions';
import { updateRupStatus, getRupPDF } from '../../actions/rangeUsePlanActions';
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
      getRupPDF,
      isDownloadingPdf,
    } = this.props;
    const {
      data: agreement,
      isLoading,
      success,
      errorMessage,
    } = agreementState;
    const statuses = references[PLAN_STATUS];

    return (
      <div>
        {(isLoading || isDownloadingPdf) &&
          <Loading />
        }
        { success &&
          <RangeUsePlan
            agreement={agreement}
            statuses={statuses}
            updateRupStatus={updateRupStatus}
            isUpdatingStatus={isUpdatingStatus}
            getRupPDF={getRupPDF}
          />
        }
        { errorMessage &&
          <Redirect to="/error" />
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    agreementState: state.rangeUsePlan,
    isDownloadingPdf: state.pdf.isLoading,
    references: state.references.data,
    isUpdatingStatus: state.updateRupStatus.isLoading,
  }
);

export default connect(mapStateToProps, { getRangeUsePlan, updateRupStatus, getRupPDF })(Base);
