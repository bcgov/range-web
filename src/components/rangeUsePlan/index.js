import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Rup from './Rup';
import EditRup from './EditRup';
import { Loading } from '../common';
import { getRangeUsePlan } from '../../actions/agreementActions';
import { updateRupStatus, getRupPDF, createOrUpdateRupSchedule } from '../../actions/rangeUsePlanActions';
import { PLAN_STATUS, LIVESTOCK_TYPE } from '../../constants/variables';

const propTypes = {
  references: PropTypes.shape({}).isRequired,
  agreementState: PropTypes.shape({}).isRequired,
  match: PropTypes.shape({}).isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
  isDownloadingPDF: PropTypes.bool.isRequired,
  getRupPDF: PropTypes.func.isRequired,
  updateRupStatus: PropTypes.func.isRequired,
  getRangeUsePlan: PropTypes.func.isRequired,
  user: PropTypes.shape({}).isRequired,
};

class Base extends Component {
  componentDidMount() {
    const { getRangeUsePlan, match } = this.props;
    const { agreementId, planId } = match.params;
    getRangeUsePlan({ agreementId, planId });
  }

  render() {
    const {
      references,
      agreementState,
      isUpdatingStatus,
      isDownloadingPDF,
      updateRupStatus,
      getRupPDF,
      createOrUpdateRupSchedule,
      user,
    } = this.props;
    const {
      data: agreement,
      isLoading,
      success,
      error,
    } = agreementState;
    const statuses = references[PLAN_STATUS];
    const livestockTypes = references[LIVESTOCK_TYPE];

    return (
      <div>
        { isLoading &&
          <Loading />
        }
        { success &&
          // <Rup
          //   agreement={agreement}
          //   statuses={statuses}
          //   livestockTypes={livestockTypes}
          //   updateRupStatus={updateRupStatus}
          //   getRupPDF={getRupPDF}
          //   isUpdatingStatus={isUpdatingStatus}
          //   isDownloadingPDF={isDownloadingPDF}
          // />
          <EditRup
            agreement={agreement}
            livestockTypes={livestockTypes}
            createOrUpdateRupSchedule={createOrUpdateRupSchedule}
          />
        }
        { error &&
          <Redirect to="/no-range-use-plan-found" />
        }
      </div>
    );
  }
}

const mapStateToProps = state => (
  {
    agreementState: state.rangeUsePlan,
    isDownloadingPDF: state.pdf.isLoading,
    references: state.references.data,
    isUpdatingStatus: state.updateRupStatus.isLoading,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  getRangeUsePlan,
  updateRupStatus,
  getRupPDF,
  createOrUpdateRupSchedule,
})(Base);
