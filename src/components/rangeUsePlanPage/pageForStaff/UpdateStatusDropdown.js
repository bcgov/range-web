import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Divider, Menu, Portal } from 'semantic-ui-react';
import {
  isPlanAmendment,
  isStatusApproved,
  isStatusCreated,
  isStatusRecommendNotReady,
  isStatusRecommendReady,
  isStatusStandsNotReviewed,
  isStatusStandsReview,
  isStatusSubmittedForFD,
  isStatusSubmittedForReview,
  isUserAdmin,
  isUserAgrologist,
  isUserDecisionMaker,
} from '../../../utils';
import { PLAN_STATUS } from '../../../constants/variables';
import { getConfirmationModalsMap, getIsUpdatingPlanStatus, getReferences } from '../../../reducers/rootReducer';
import { updateRUPStatus } from '../../../actionCreators';
import * as strings from '../../../constants/strings';
import UpdateStatusModal from './UpdateStatusModal';
import { Loading } from '../../common';

class UpdateStatusDropdown extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    plan: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    confirmationModalsMap: PropTypes.shape({}).isRequired,
    isUpdatingStatus: PropTypes.bool.isRequired,
    updateRUPStatus: PropTypes.func.isRequired,
    fetchPlan: PropTypes.func.isRequired,
    isFetchingPlan: PropTypes.bool.isRequired,
  };

  state = {
    updateStatusModalOpen: false,
    modal: null,
    loading: false,
  };

  closeUpdateStatusModalOpen = () => this.setState({ updateStatusModalOpen: false });
  openUpdateStatusModalOpen = (modal) => {
    this.setState({
      updateStatusModalOpen: true,
      modal,
    });
  };

  openConfirmModalForUpdatingPlanStatus = async (modal) => {
    this.setState({ loading: true });

    try {
      const canUpdate = await this.props.beforeUpdateStatus(modal.statusCode);
      if (canUpdate) {
        this.openUpdateStatusModalOpen(modal);
      }
    } catch (e) {
      console.error(e);
    }

    this.setState({ loading: false });
  };

  // openCompletedConfirmModal = () => {
  //   this.openConfirmModalForUpdatingPlanStatus({
  //     header: strings.COMPLETED_CONFIRM_HEADER,
  //     content: strings.COMPLETED_CONFIRM_CONTENT,
  //     statusCode: PLAN_STATUS.COMPLETED,
  //   });
  // };

  openChangeRequestConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.CHANGE_REQUEST_CONFIRM_HEADER,
      content: strings.CHANGE_REQUEST_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.CHANGE_REQUESTED,
    });
  };

  openWMWEConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRM_HEADER,
      content: strings.WRONGLY_MADE_WITHOUT_EFFECT_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT,
    });
  };

  openSWMConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.STANDS_WRONGLY_MADE_CONFIRM_HEADER,
      content: strings.STANDS_WRONGLY_MADE_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.STANDS_WRONGLY_MADE,
    });
  };

  openApprovedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.APPROVED_CONFIRM_HEADER,
      content: strings.APPROVED_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.APPROVED,
    });
  };

  openNotApprovedConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.NOT_APPROVED_CONFIRM_HEADER,
      content: strings.NOT_APPROVED_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.NOT_APPROVED,
    });
  };

  openNotApprovedFWRConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.NOT_APPROVED_FWR_CONFIRM_HEADER,
      content: strings.NOT_APPROVED_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION,
    });
  };

  openRecommendReadyConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_READY_CONFIRM_HEADER,
      content: strings.RECOMMEND_READY_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_READY,
    });
  };

  openRecommendNotReadyConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_NOT_READY_CONFIRM_HEADER,
      content: strings.RECOMMEND_NOT_READY_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_NOT_READY,
    });
  };

  openRFSConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.RECOMMEND_FOR_SUBMISSION_CONFIRM_HEADER,
      content: strings.RECOMMEND_FOR_SUBMISSION_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.RECOMMEND_FOR_SUBMISSION,
    });
  };

  openStandsConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.STANDS_CONFIRM_HEADER,
      content: strings.STANDS_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.STANDS,
    });
  };

  openStandsReviewConfirmModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.STANDS_REVIEW_HEADER,
      content: strings.STANDS_REVIEW_CONTENT,
      statusCode: PLAN_STATUS.STANDS_REVIEW,
    });
  };

  openDraftModal = () => {
    this.openConfirmModalForUpdatingPlanStatus({
      header: strings.DRAFT_CONFIRM_HEADER,
      content: strings.DRAFT_CONFIRM_CONTENT,
      statusCode: PLAN_STATUS.STAFF_DRAFT,
    });
  };

  getStatusDropdownOptions = (user, plan, isFetchingPlan, status) => {
    if (isFetchingPlan) {
      return [
        {
          key: 'fetchingPlan',
          text: 'Checking RUP status...',
        },
      ];
    }
    const draft = {
      key: PLAN_STATUS.STAFF_DRAFT,
      text: 'Draft',
      onClick: this.openDraftModal,
    };

    const requestChanges = {
      key: PLAN_STATUS.CHANGE_REQUESTED,
      text: 'Request Changes',
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
    const stands = {
      key: PLAN_STATUS.STANDS,
      text: 'Stands',
      onClick: this.openStandsConfirmModal,
    };
    const standsReview = {
      key: PLAN_STATUS.STANDS_REVIEW,
      text: 'Stands - Requires Review',
      onClick: this.openStandsReviewConfirmModal,
    };
    const warningDivider = {
      key: 'warningDivider',
      text: 'WARNING: Below entries are manual overrides.',
    };
    let overrides = [];
    if (isUserAdmin(user)) {
      overrides = [
        warningDivider,
        draft,
        stands,
        standsWronglyMade,
        approved,
        notApproved,
        requestChanges,
        recommendReady,
        recommendNotReady,
        recommendForSubmission,
      ];
    } else if (isUserAgrologist(user) && !isStatusApproved(status) && !isPlanAmendment(plan)) {
      overrides = [draft];
    }

    if (isStatusStandsNotReviewed(status)) {
      return [stands, standsReview, ...overrides];
    } else if (isStatusStandsReview(status)) {
      if (isUserDecisionMaker(user)) return [stands, standsWronglyMade, wronglyMadeWithoutEffect, ...overrides];
    } else if (isStatusSubmittedForReview(status)) {
      return [requestChanges, recommendForSubmission, ...overrides];
    } else if (isStatusSubmittedForFD(status)) {
      return [recommendReady, recommendNotReady, requestChanges, ...overrides];
    } else if (isStatusRecommendReady(status) || isStatusRecommendNotReady(status)) {
      if (isUserAgrologist(user)) {
        return overrides;
      }
      if (isPlanAmendment(plan)) {
        return [approved, notApproved, notApprovedFWR, ...overrides];
      }
      return [approved, notApprovedFWR, ...overrides];
    } else if (isStatusCreated(status)) {
      return [requestChanges, ...overrides];
    }

    return overrides;
  };

  render() {
    const { modal, updateStatusModalOpen } = this.state;
    const { user, plan, isFetchingPlan } = this.props;
    const status = plan && plan.status;

    const statusDropdownOptions = this.getStatusDropdownOptions(user, plan, isFetchingPlan, status);

    return (
      <Fragment>
        <>
          <Divider />
          <Menu.Header>{strings.PLAN_ACTIONS}</Menu.Header>
          {statusDropdownOptions.map((o) => (
            <Menu.Item key={o.key} value={o.text} onClick={o.onClick} disabled={o.key === 'noOption'}>
              {o.text}
            </Menu.Item>
          ))}
        </>
        <UpdateStatusModal
          open={updateStatusModalOpen}
          onClose={this.closeUpdateStatusModalOpen}
          {...this.props}
          {...modal}
        />
        <Portal open={this.state.loading}>
          <Loading active={this.state.loading} containerProps={{ page: true }} />
        </Portal>
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  references: getReferences(state),
  isUpdatingStatus: getIsUpdatingPlanStatus(state),
  confirmationModalsMap: getConfirmationModalsMap(state),
});

export default connect(mapStateToProps, {
  updateRUPStatus,
})(UpdateStatusDropdown);
