import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Rup from './Rup';
import RupAH from './RupAH';
import { Loading } from '../common';
import { getRangeUsePlan } from '../../actions/agreementActions';
import { updateRupStatus, getRupPDF, createOrUpdateRupSchedule, deleteRupSchedule, deleteRupScheduleEntry } from '../../actions/rangeUsePlanActions';
import { toastSuccessMessage, toastErrorMessage } from '../../actions/toastActions';
import { PLAN_STATUS, LIVESTOCK_TYPE } from '../../constants/variables';
import User from '../../models/User';

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
  createOrUpdateRupSchedule: PropTypes.func.isRequired,
  toastErrorMessage: PropTypes.func.isRequired,
  toastSuccessMessage: PropTypes.func.isRequired,
  deleteRupSchedule: PropTypes.func.isRequired,
  deleteRupScheduleEntry: PropTypes.func.isRequired,
  isDeletingSchedule: PropTypes.bool.isRequired,
  isDeletingScheduleEntry: PropTypes.bool.isRequired,
};

class Base extends Component {
  componentDidMount() {
    const { getRangeUsePlan, match } = this.props;
    const { planId } = match.params;
    getRangeUsePlan(planId);
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
      toastErrorMessage,
      toastSuccessMessage,
      user: u,
      deleteRupSchedule,
      deleteRupScheduleEntry,
      isDeletingSchedule,
      isDeletingScheduleEntry,
    } = this.props;
    const user = new User(u);

    const {
      data: agreement,
      isLoading,
      success,
      error,
    } = agreementState;

    const statuses = references[PLAN_STATUS];
    const livestockTypes = references[LIVESTOCK_TYPE];

    let rup;
    if (user.isAgreementHolder) {
      rup = (
        <RupAH
          user={user}
          agreement={agreement}
          statuses={statuses}
          livestockTypes={livestockTypes}
          createOrUpdateRupSchedule={createOrUpdateRupSchedule}
          updateRupStatus={updateRupStatus}
          toastErrorMessage={toastErrorMessage}
          toastSuccessMessage={toastSuccessMessage}
          deleteRupSchedule={deleteRupSchedule}
          deleteRupScheduleEntry={deleteRupScheduleEntry}
          isDeletingSchedule={isDeletingSchedule}
          isDeletingScheduleEntry={isDeletingScheduleEntry}
        />
      );
    } else {
      rup = (
        <Rup
          user={user}
          agreement={agreement}
          statuses={statuses}
          livestockTypes={livestockTypes}
          updateRupStatus={updateRupStatus}
          getRupPDF={getRupPDF}
          isUpdatingStatus={isUpdatingStatus}
          isDownloadingPDF={isDownloadingPDF}
        />
      );
    }

    return (
      <div>
        { isLoading &&
          <Loading />
        }
        { success &&
          rup
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
    isDeletingSchedule: state.deleteRupSchedule.isLoading,
    isDeletingScheduleEntry: state.deleteRupScheduleEntry.isLoading,
  }
);

Base.propTypes = propTypes;
export default connect(mapStateToProps, {
  getRangeUsePlan,
  updateRupStatus,
  getRupPDF,
  createOrUpdateRupSchedule,
  toastErrorMessage,
  toastSuccessMessage,
  deleteRupSchedule,
  deleteRupScheduleEntry,
})(Base);
