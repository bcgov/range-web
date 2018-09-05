import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropdown } from 'semantic-ui-react';
import { isPlanAmendment, isStatusStands, isStatusPending, isStatusCreated, isStatusCompleted, isStatusSubmittedForFD, isStatusSubmittedForReview, isStatusRecommendReady } from '../../utils';
import { PLAN_STATUS, CONFIRMATION_MODAL_ID, REFERENCE_KEY } from '../../constants/variables';
import { getReferences, getIsUpdatingPlanStatus } from '../../reducers/rootReducer';
import { openConfirmationModal, closeConfirmationModal, planUpdated } from '../../actions';
import { updateRUPStatus } from '../../actionCreators';
import * as strings from '../../constants/strings';

const propTypes = {
  plan: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  openConfirmationModal: PropTypes.func.isRequired,
  closeConfirmationModal: PropTypes.func.isRequired,
  planUpdated: PropTypes.func.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
  updateRUPStatus: PropTypes.func.isRequired,
};

class UpdateStatusDropdown extends Component {
  openConfirmModalForUpdatingPlanStatus = ({ header, content, statusCode }) => {
    this.props.openConfirmationModal({
      modal: {
        id: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS,
        header,
        content,
        onYesBtnClicked: () => this.updateStatus(statusCode),
      },
    });
  }

  openCompletedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.COMPLETED_CONFIRMATION_HEADER,
      content: strings.COMPLETED_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.COMPLETED,
    });
  }

  openChangeRequestConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.CHANGE_REQUEST_CONFIRMATION_HEADER,
      content: strings.CHANGE_REQUEST_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.CHANGE_REQUESTED,
    });
  }

  openWMWEConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRMATION_HEADER,
      content: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT,
    });
  }

  openSWMConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.STANDS_WRONGLY_MADE_CONFIRMATION_HEADER,
      content: strings.STANDS_WRONGLY_MADE_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.STANDS_WRONGLY_MADE,
    });
  }

  openApprovedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.APPROVED_CONFIRMATION_HEADER,
      content: strings.APPROVED_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.APPROVED,
    });
  }

  openNotApprovedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.NOT_APPROVED_CONFIRMATION_HEADER,
      content: strings.NOT_APPROVED_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.NOT_APPROVED,
    });
  }

  openNotApprovedFWRConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.NOT_APPROVED_FWR_CONFIRMATION_HEADER,
      content: strings.NOT_APPROVED_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED,
    });
  }

  openRecommendReadyConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_READY_CONFIRMATION_HEADER,
      content: strings.RECOMMEND_READY_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_READY,
    });
  }

  openRecommendNotReadyConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_NOT_READY_CONFIRMATION_HEADER,
      content: strings.RECOMMEND_NOT_READY_CONFIRMATION_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_NOT_READY,
    });
  }

  updateStatus = (statusCode) => {
    const {
      plan,
      references,
      updateRUPStatus,
      planUpdated,
      closeConfirmationModal,
    } = this.props;

    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.UPDATE_PLAN_STATUS });

    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS] || [];
    const status = planStatuses.find(s => s.code === statusCode);
    if (status && plan) {
      const statusUpdated = (newStatus) => {
        const newPlan = {
          ...plan,
          status: newStatus,
        };
        planUpdated({ plan: newPlan });
      };
      updateRUPStatus(plan.id, status.id).then(statusUpdated);
    }
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
      text: 'Not Approved - Further...',
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
        options = [changeRequested];
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
    const { plan, isUpdatingStatus } = this.props;
    const status = plan && plan.status;

    const statusDropdownOptions = this.getStatusDropdownOptions(plan, status);

    return (
      <Dropdown
        text={strings.UPDATE_STATUS}
        options={statusDropdownOptions}
        disabled={statusDropdownOptions.length === 0}
        style={{ marginLeft: '10px' }}
        loading={isUpdatingStatus}
        button
        item
      />
    );
  }
}


const mapStateToProps = state => (
  {
    references: getReferences(state),
    isUpdatingStatus: getIsUpdatingPlanStatus(state),
  }
);

UpdateStatusDropdown.propTypes = propTypes;
export default connect(mapStateToProps, {
  planUpdated,
  openConfirmationModal,
  closeConfirmationModal,
  updateRUPStatus,
})(UpdateStatusDropdown);
