import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { Status, Banner } from '../common';
import ViewRupBasicInformation from './view/ViewRupBasicInformation';
import ViewRupPastures from './view/ViewRupPastures';
import ViewRupGrazingSchedules from './view/ViewRupGrazingSchedules';
import ViewRupMinisterIssues from './view/ViewRupMinisterIssues';
import EditRupGrazingSchedules from './edit/EditRupGrazingSchedules';
import AmendmentSubmissionModal from './amendment/AmendmentSubmissionModal';
import AmendmentConfirmationModal from './amendment/AmendmentConfirmationModal';
import RupStickyHeader from './RupStickyHeader';
import RupBackBtn from './RupBackBtn';
import { PLAN_STATUS, REFERENCE_KEY, CONFIRMATION_MODAL_ID } from '../../constants/variables';
import { RANGE_USE_PLAN, EXPORT_PDF } from '../../constants/routes';
import * as strings from '../../constants/strings';
import * as utils from '../../utils';

export class RupAH extends Component {
  static propTypes = {
    agreement: PropTypes.shape({ plan: PropTypes.object }),
    plan: PropTypes.shape({}),
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    grazingSchedulesMap: PropTypes.shape({}).isRequired,
    ministerIssuesMap: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
    updateRUPStatus: PropTypes.func.isRequired,
    createOrUpdateRupGrazingSchedule: PropTypes.func.isRequired,
    toastSuccessMessage: PropTypes.func.isRequired,
    toastErrorMessage: PropTypes.func.isRequired,
    createAmendment: PropTypes.func.isRequired,
    isCreatingAmendment: PropTypes.bool.isRequired,
    planUpdated: PropTypes.func.isRequired,
    openConfirmationModal: PropTypes.func.isRequired,
    closeConfirmationModal: PropTypes.func.isRequired,
  };
  static defaultProps = {
    agreement: {
      zone: {},
      usage: [],
    },
    plan: {
      agreementId: '',
      pastures: [],
      grazingSchedules: [],
      ministerIssues: [],
      confirmations: [],
    },
  };

  state = {
    isSubmitAmendmentModalOpen: false,
    isConfirmAmendmentModalOpen: false,
    isSavingAsDraft: false,
    isSubmitting: false,
  };

  onSaveDraftClick = () => {
    const {
      plan,
      planUpdated,
      references,
      toastSuccessMessage,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.DRAFT);
    const onRequested = () => {
      this.setState({ isSavingAsDraft: true });
    };
    const onSuccess = () => {
      // update schedules in Redux store
      const newPlan = { ...plan, status };
      planUpdated({ plan: newPlan });
      this.setState({ isSavingAsDraft: false });
      toastSuccessMessage(strings.SAVE_PLAN_AS_DRAFT_SUCCESS);
    };
    const onError = () => {
      this.setState({ isSavingAsDraft: false });
    };

    this.updateStatusAndContent(status, onRequested, onSuccess, onError);
  }

  onSubmitClicked = () => {
    const {
      plan,
      planUpdated,
      references,
      toastSuccessMessage,
      closeConfirmationModal,
    } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.PENDING);

    const onRequested = () => {
      this.setState({ isSubmitting: true });
    };

    const onSuccess = () => {
      // update the status and schedules of the plan in Redux store
      const newPlan = { ...plan, status };
      planUpdated({ plan: newPlan });
      this.setState({ isSubmitting: false });
      toastSuccessMessage(strings.SUBMIT_PLAN_SUCCESS);
    };

    const onError = () => {
      this.setState({ isSubmitting: false });
    };
    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.SUBMIT_PLAN });
    this.updateStatusAndContent(status, onRequested, onSuccess, onError);
  }

  updateStatusAndContent = async (status, onRequested, onSuccess, onError) => {
    const {
      plan,
      updateRUPStatus,
      createOrUpdateRupGrazingSchedule,
      grazingSchedulesMap,
      toastErrorMessage,
    } = this.props;

    onRequested();

    const error = this.validateRup(plan);

    if (error) {
      onError();
      return;
    }

    const planId = plan && plan.id;
    const statusId = status && status.id;
    const grazingSchedules = plan && plan.grazingSchedules
      && plan.grazingSchedules.map(id => grazingSchedulesMap[id]);

    try {
      await updateRUPStatus(planId, statusId, false);
      const newSchedules = await Promise.all(grazingSchedules.map(schedule => (
        createOrUpdateRupGrazingSchedule(planId, schedule)
      )));
      onSuccess(newSchedules);
    } catch (err) {
      onError(err);
      toastErrorMessage(err);
      throw err;
    }
  }

  onAmendPlanClicked = () => {
    const {
      plan,
      agreement,
      createAmendment,
      history,
      toastSuccessMessage,
    } = this.props;

    createAmendment(plan).then((amendment) => {
      toastSuccessMessage(strings.CREATE_AMENDMENT_SUCCESS);
      history.push(`${RANGE_USE_PLAN}/${agreement.id}/${amendment.id}`);
    });
  }

  validateRup = (plan) => {
    const {
      references,
      agreement,
      pasturesMap,
      grazingSchedulesMap,
    } = this.props;
    const usage = agreement && agreement.usage;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const errors = utils.handleRupValidation(plan, pasturesMap, grazingSchedulesMap, livestockTypes, usage);

    // errors have been found
    if (errors.length !== 0) {
      const [error] = errors;
      document.getElementById(error.elementId).scrollIntoView({
        behavior: 'smooth',
      });
      return error;
    }

    // no errors found
    return false;
  }

  onViewPDFClicked = () => {
    const { id: planId, agreementId } = this.props.plan || {};
    window.open(`${EXPORT_PDF}/${agreementId}/${planId}`, '_blank');
  }

  openSubmitConfirmModal = () => {
    const { plan, openConfirmationModal } = this.props;
    const error = this.validateRup(plan);
    if (!error) {
      if (utils.isPlanAmendment(plan)) {
        this.openSubmitAmendmentModal();
        return;
      }
      openConfirmationModal({
        modal: {
          id: CONFIRMATION_MODAL_ID.SUBMIT_PLAN,
          header: strings.SUBMIT_RUP_CHANGE_FOR_AH_HEADER,
          content: strings.SUBMIT_RUP_CHANGE_FOR_AH_CONTENT,
          onYesBtnClicked: this.onSubmitClicked,
        },
      });
    }
  }

  openSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: true })
  closeSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: false })
  openConfirmAmendmentModal = () => this.setState({ isConfirmAmendmentModalOpen: true })
  closeConfirmAmendmentModal = () => this.setState({ isConfirmAmendmentModalOpen: false })

  renderActionBtns = (canEdit, canAmend, canConfirm) => {
    const { isSavingAsDraft, isSubmitting } = this.state;
    const { isCreatingAmendment } = this.props;
    const previewPDF = (
      <Button key="previewPDFBtn" onClick={this.onViewPDFClicked}>
        {strings.PREVIEW_PDF}
      </Button>
    );
    const saveDraft = (
      <Button
        key="saveDraftBtn"
        loading={isSavingAsDraft}
        onClick={this.onSaveDraftClick}
        style={{ marginLeft: '10px' }}
      >
        {strings.SAVE_DRAFT}
      </Button>
    );
    const submit = (
      <Button
        key="submitBtn"
        loading={isSubmitting}
        onClick={this.openSubmitConfirmModal}
        style={{ marginLeft: '10px' }}
      >
        {strings.SUBMIT}
      </Button>
    );
    const amend = (
      <Button
        key="amendBtn"
        loading={isCreatingAmendment}
        onClick={this.onAmendPlanClicked}
        style={{ marginLeft: '10px' }}
      >
        {strings.AMEND_PLAN}
      </Button>
    );
    const confirmSubmission = (
      <Button
        key="confirmSubmissionBtn"
        style={{ marginLeft: '10px' }}
        onClick={this.openConfirmAmendmentModal}
      >
        {strings.CONFIRM_SUBMISSION}
      </Button>
    );
    if (canEdit) {
      return [previewPDF, saveDraft, submit];
    } else if (canAmend) {
      return [previewPDF, amend];
    } else if (canConfirm) {
      return [previewPDF, confirmSubmission];
    }
    return previewPDF;
  }

  renderNotifications = () => {
    const { plan, confirmationsMap } = this.props;
    const { confirmations, status } = plan;
    let numberOfConfirmed = 0;
    confirmations.forEach((cId) => {
      if (confirmationsMap[cId].confirmed) numberOfConfirmed += 1;
    });

    return (
      <Fragment>
        {utils.isStatusAwaitingConfirmation(status) &&
          <div className="rup__confirmations-notification">
            <div className="rup__confirmations-notification__left">
              <Icon name="check square" size="large" style={{ marginRight: '5px' }} />
              {`${numberOfConfirmed}/${confirmations.length}`} Confirmations Received
            </div>
            <Button>View Submission Status</Button>
          </div>
        }
      </Fragment>
    );
  }

  render() {
    const {
      isSubmitAmendmentModalOpen,
      isConfirmAmendmentModalOpen,
    } = this.state;

    const {
      plan,
      user,
      agreement,
      references,
      pasturesMap,
      grazingSchedulesMap,
      ministerIssuesMap,
      confirmationsMap,
    } = this.props;

    const { agreementId, status, confirmations } = plan;
    const { clients, usage } = agreement;
    const { primaryAgreementHolder } = utils.getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    const canEdit = utils.isStatusAllowingRevisionForAH(status);
    const canAmend = utils.isStatusAmongApprovedStatuses(status);
    const canConfirm = utils.canUserSubmitConfirmation(status, user, confirmations, confirmationsMap);
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const header = utils.getPlanTypeDescription(plan, amendmentTypes);

    return (
      <section className="rup">
        <AmendmentSubmissionModal
          open={isSubmitAmendmentModalOpen}
          onClose={this.closeSubmitAmendmentModal}
          plan={plan}
          clients={clients}
          updateStatusAndContent={this.updateStatusAndContent}
        />

        <AmendmentConfirmationModal
          open={isConfirmAmendmentModalOpen}
          onClose={this.closeConfirmAmendmentModal}
          plan={plan}
          clients={clients}
        />
        <Banner
          noDefaultHeight
          header={header}
          content={utils.getBannerContentForAH(status)}
        />

        <RupStickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <RupBackBtn
                className="rup__back-btn"
              />
              <div className="rup__actions__left">
                <div className="rup__actions__title">{agreementId}</div>
                <div className="rup__actions__primary-agreement-holder">{primaryAgreementHolderName}</div>
                <Status
                  className="rup__status"
                  status={status}
                  user={user}
                />
              </div>
              <div className="rup__actions__btns">
                {this.renderActionBtns(canEdit, canAmend, canConfirm)}
              </div>
            </div>
          </div>
        </RupStickyHeader>

        <div className="rup__content">
          {this.renderNotifications(plan, confirmationsMap)}

          <ViewRupBasicInformation
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            user={user}
          />

          <ViewRupPastures
            className="rup__pastures__container"
            plan={plan}
            pasturesMap={pasturesMap}
          />

          {canEdit ?
            <EditRupGrazingSchedules
              className="rup__grazing-schedules__container"
              references={references}
              usage={usage}
              plan={plan}
              pasturesMap={pasturesMap}
              grazingSchedulesMap={grazingSchedulesMap}
            />
            : <ViewRupGrazingSchedules
              className="rup__grazing-schedules__container"
              references={references}
              usage={usage}
              plan={plan}
              pasturesMap={pasturesMap}
              grazingSchedulesMap={grazingSchedulesMap}
            />
          }

          <ViewRupMinisterIssues
            className="rup__missues__container"
            references={references}
            plan={plan}
            pasturesMap={pasturesMap}
            ministerIssuesMap={ministerIssuesMap}
          />
        </div>
      </section>
    );
  }
}

export default RupAH;
