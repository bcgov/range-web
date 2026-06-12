import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import Divider from '@mui/material/Divider';
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

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

interface UpdateStatusDropdownProps {
  user: any;
  plan: any;
  references: any;
  confirmationModalsMap: any;
  isUpdatingStatus: boolean;
  updateRUPStatus: (...args: any[]) => any;
  fetchPlan: () => Promise<any>;
  isFetchingPlan: boolean;
  beforeUpdateStatus: (statusCode: string) => Promise<boolean>;
}

interface UpdateStatusDropdownState {
  updateStatusModalOpen: boolean;
  modal: any;
  loading: boolean;
}

class UpdateStatusDropdown extends Component<UpdateStatusDropdownProps, UpdateStatusDropdownState> {
  state: UpdateStatusDropdownState = {
    updateStatusModalOpen: false,
    modal: null,
    loading: false,
  };

  closeUpdateStatusModalOpen = () => this.setState({ updateStatusModalOpen: false });
  openUpdateStatusModalOpen = (modal: any) => {
    this.setState({
      updateStatusModalOpen: true,
      modal,
    });
  };

  openConfirmModalForUpdatingPlanStatus = async (modal: any) => {
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
      statusCode: PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED,
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

  getStatusDropdownOptions = (user: any, plan: any, isFetchingPlan: boolean, status: any) => {
    if (isFetchingPlan) {
      return [
        {
          key: 'fetchingPlan',
          text: 'Checking RUP status...',
        },
      ];
    }

    const dedupe = (main: any[], overrides: any[]) => {
      const mainKeys = new Set(main.map((o) => o.key));
      return [...main, ...overrides.filter((o) => !mainKeys.has(o.key))];
    };

    const draft = { key: PLAN_STATUS.STAFF_DRAFT, text: 'Draft', onClick: this.openDraftModal };
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
    const approved = { key: PLAN_STATUS.APPROVED, text: 'Approved', onClick: this.openApprovedConfirmModal };
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
    const stands = { key: PLAN_STATUS.STANDS, text: 'Stands', onClick: this.openStandsConfirmModal };
    const standsReview = {
      key: PLAN_STATUS.STANDS_REVIEW,
      text: 'Stands - Requires Review',
      onClick: this.openStandsReviewConfirmModal,
    };
    const warningDivider = {
      key: 'warningDivider',
      text: 'WARNING: Below entries are manual overrides.',
      disabled: true,
    };

    let overrides: any[] = [];
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
    } else if (
      isUserAgrologist(user) &&
      !isStatusApproved(status) &&
      !isStatusRecommendReady(status) &&
      !isStatusRecommendNotReady(status) &&
      !isPlanAmendment(plan)
    ) {
      overrides = [draft];
    }

    if (isStatusStandsNotReviewed(status)) {
      return dedupe([stands, standsReview], overrides);
    } else if (isStatusStandsReview(status)) {
      if (isUserDecisionMaker(user)) return dedupe([stands, standsWronglyMade, wronglyMadeWithoutEffect], overrides);
    } else if (isStatusSubmittedForReview(status)) {
      return dedupe([requestChanges, recommendForSubmission], overrides);
    } else if (isStatusSubmittedForFD(status)) {
      return dedupe([recommendReady, recommendNotReady, requestChanges], overrides);
    } else if (isStatusRecommendReady(status) || isStatusRecommendNotReady(status)) {
      if (isUserAgrologist(user)) {
        return overrides;
      }
      if (isPlanAmendment(plan)) {
        return dedupe([approved, notApproved, notApprovedFWR], overrides);
      }
      return dedupe([approved, notApprovedFWR], overrides);
    } else if (isStatusCreated(status)) {
      return dedupe([requestChanges], overrides);
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
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, fontWeight: 600 }}>
            {strings.PLAN_ACTIONS}
          </Typography>
          <List dense disablePadding>
            {statusDropdownOptions.map((o: any) => (
              <ListItemButton key={o.key} onClick={o.onClick} disabled={o.disabled || o.key === 'noOption'}>
                <ListItemText primary={o.text} />
              </ListItemButton>
            ))}
          </List>
        </>
        <UpdateStatusModal
          open={updateStatusModalOpen}
          onClose={this.closeUpdateStatusModalOpen}
          {...this.props}
          {...modal}
        />
        <Backdrop open={this.state.loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  references: getReferences(state),
  isUpdatingStatus: getIsUpdatingPlanStatus(state),
  confirmationModalsMap: getConfirmationModalsMap(state),
});

export default connect(mapStateToProps, {
  updateRUPStatus,
})(UpdateStatusDropdown as any);
