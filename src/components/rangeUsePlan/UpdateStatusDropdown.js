import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { isPlanAmendment, isStatusStands, isStatusPending, isStatusCreated, isStatusCompleted, isStatusSubmittedForFD, isStatusSubmittedForReview, isStatusRecommendReady } from '../../utils';
import { PLAN_STATUS } from '../../constants/variables';
import { getReferences, getIsUpdatingPlanStatus, getConfirmationModalsMap } from '../../reducers/rootReducer';
import { planUpdated, addPlanStatusHistoryRecord } from '../../actions';
import { updateRUPStatus, createRUPStatusHistoryRecord } from '../../actionCreators';
import * as strings from '../../constants/strings';
import UpdateStatusModal from './UpdateStatusModal';

class UpdateStatusDropdown extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    confirmationModalsMap: PropTypes.shape({}).isRequired,
    planUpdated: PropTypes.func.isRequired,
    addPlanStatusHistoryRecord: PropTypes.func.isRequired,
    isUpdatingStatus: PropTypes.bool.isRequired,
    updateRUPStatus: PropTypes.func.isRequired,
    createRUPStatusHistoryRecord: PropTypes.func.isRequired,
  };

  state = {
    updateStatusModalOpen: false,
    modal: null,
  }

  closeUpdateStatusModalOpen = () => this.setState({ updateStatusModalOpen: false });
  openUpdateStatusModalOpen = (modal) => {
    this.setState({
      updateStatusModalOpen: true,
      modal,
    });
  }

  openConfirmModalForUpdatingPlanStatus = (modal) => {
    this.openUpdateStatusModalOpen(modal);
  }

  openCompletedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.COMPLETED_CONFIRM_HEADER,
      content: strings.COMPLETED_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.COMPLETED,
    });
  }

  openChangeRequestConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.CHANGE_REQUEST_CONFIRM_HEADER,
      content: strings.CHANGE_REQUEST_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.CHANGE_REQUESTED,
    });
  }

  openWMWEConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRM_HEADER,
      content: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT,
    });
  }

  openSWMConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.STANDS_WRONGLY_MADE_CONFIRM_HEADER,
      content: strings.STANDS_WRONGLY_MADE_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.STANDS_WRONGLY_MADE,
    });
  }

  openApprovedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.APPROVED_CONFIRM_HEADER,
      content: strings.APPROVED_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.APPROVED,
    });
  }

  openNotApprovedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.NOT_APPROVED_CONFIRM_HEADER,
      content: strings.NOT_APPROVED_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.NOT_APPROVED,
    });
  }

  openNotApprovedFWRConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.NOT_APPROVED_FWR_CONFIRM_HEADER,
      content: strings.NOT_APPROVED_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED,
    });
  }

  openRecommendReadyConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_READY_CONFIRM_HEADER,
      content: strings.RECOMMEND_READY_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_READY,
    });
  }

  openRecommendNotReadyConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_NOT_READY_CONFIRM_HEADER,
      content: strings.RECOMMEND_NOT_READY_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_NOT_READY,
    });
  }

  openRFSConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_FOR_SUBMISSION_CONFIRM_HEADER,
      content: strings.RECOMMEND_FOR_SUBMISSION_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_FOR_SUBMISSION,
    });
  }

  getStatusDropdownOptions = (plan, status) => {
    const completed = {
      key: PLAN_STATUS.COMPLETED,
      text: 'Completed',
      onClick: this.openCompletedConfirmModal,
    };
    const changeRequested = {
      key: PLAN_STATUS.CHANGE_REQUESTED,
      text: 'Change Request',
      onClick: this.openChangeRequestConfirmModal,
    };
    const recommendReady = {
      key: PLAN_STATUS.RECOMMEND_READY,
      text: 'Recommend Ready',
      onClick: this.openRecommendReadyConfirmModal,
    };
    const recommendNotReady = {
      key: PLAN_STATUS.RECOMMEND_NOT_READY,
      text: 'Recommend Not Ready',
      onClick: this.openRecommendNotReadyConfirmModal,
    };
    const recommendForSubmission = {
      key: PLAN_STATUS.RECOMMEND_FOR_SUBMISSION,
      text: 'Recommend For Submission',
      onClick: this.openRFSConfirmModal,
    };
    const approved = {
      key: PLAN_STATUS.APPROVED,
      text: 'Approved',
      onClick: this.openApprovedConfirmModal,
    };
    const notApproved = {
      key: PLAN_STATUS.NOT_APPROVED,
      text: 'Not Approved',
      onClick: this.openNotApprovedConfirmModal,
    };
    const notApprovedFWR = {
      key: PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED,
      text: 'Not Approved - Further Work Required',
      onClick: this.openNotApprovedFWRConfirmModal,
    };
    const wronglyMadeWithoutEffect = {
      key: PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT,
      text: 'Wrongly Made - Without Effect',
      onClick: this.openWMWEConfirmModal,
    };
    const standsWronglyMade = {
      key: PLAN_STATUS.STANDS_WRONGLY_MADE,
      text: 'Stands - Wrongly Made',
      onClick: this.openSWMConfirmModal,
    };

    let options = [];
    if (isPlanAmendment(plan)) { // for Amendment
      if (isStatusStands(status)) {
        options = [wronglyMadeWithoutEffect, standsWronglyMade];
      } else if (isStatusSubmittedForReview(status)) {
        options = [changeRequested, recommendForSubmission];
      } else if (isStatusSubmittedForFD(status)) {
        options = [recommendReady, recommendNotReady];
      } else if (isStatusRecommendReady(status)) {
        options = [approved, notApproved, notApprovedFWR];
      }
    } else if (!isPlanAmendment(plan)) { // for initial plan
      if (isStatusPending(status) || isStatusCreated(status)) {
        options = [completed, changeRequested];
      } else if (isStatusCompleted(status)) {
        options = [approved];
      }
    }

    return options;
  }

  render() {
    const { modal, updateStatusModalOpen } = this.state;
    const { plan, isUpdatingStatus } = this.props;
    const status = plan && plan.status;

    const statusDropdownOptions = this.getStatusDropdownOptions(plan, status);

    return (
      <Fragment>
        <Dropdown
          className="rup__update-status-dropdown"
          text={strings.UPDATE_STATUS}
          options={statusDropdownOptions}
          disabled={statusDropdownOptions.length === 0}
          loading={isUpdatingStatus}
          button
          item
        />
        <UpdateStatusModal
          open={updateStatusModalOpen}
          onClose={this.closeUpdateStatusModalOpen}
          {...this.props}
          {...modal}
        />
      </Fragment>
    );
  }
}


const mapStateToProps = state => (
  {
    references: getReferences(state),
    isUpdatingStatus: getIsUpdatingPlanStatus(state),
    confirmationModalsMap: getConfirmationModalsMap(state),
  }
);

export default connect(mapStateToProps, {
  planUpdated,
  addPlanStatusHistoryRecord,
  updateRUPStatus,
  createRUPStatusHistoryRecord,
})(UpdateStatusDropdown);
