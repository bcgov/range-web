import React, { Component } from 'react';
import { PLAN_STATUS, REFERENCE_KEY, CONFIRMATION_MODAL_ID, ELEMENT_ID } from '../../../constants/variables';
import { RANGE_USE_PLAN, EXPORT_PDF } from '../../../constants/routes';
import * as strings from '../../../constants/strings';
import * as utils from '../../../utils';
import { Status, Banner } from '../../common';
import ContentsContainer from '../ContentsContainer';
import BackBtn from '../BackBtn';
import Notifications from '../Notifications';
import StickyHeader from '../StickyHeader';
import BasicInformation from '../basicInformation';
import Pastures from '../pastures';
import GrazingSchedules from '../grazingSchedules';
import EditableGrazingSchedules from '../editableGrazingSchedules';
import MinisterIssues from '../ministerIssues';
import EditableMinisterIssues from '../editableMinisterIssues';
import UsageTable from '../usage';
import InvasivePlantChecklist from '../invasivePlantChecklist';
import EditableInvasivePlantChecklist from '../editableInvasivePlantChecklist';
import AdditionalRequirements from '../additionalRequirements';
import ManagementConsiderations from '../managementConsiderations';
import EditableManagementConsiderations from '../editableManagementConsiderations';
import AmendmentSubmissionModal from '../amendment/AmendmentSubmissionModal';
import AmendmentConfirmationModal from '../amendment/AmendmentConfirmationModal';
import { defaultProps, propTypes } from './props';
import ActionBtns from './ActionBtns';

// Agreement Holder page
class PageForAH extends Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  state = {
    isSubmitAmendmentModalOpen: false,
    isConfirmAmendmentModalOpen: false,
    isSavingAsDraft: false,
    isSubmitting: false,
  };

  onSaveDraftClick = () => {
    const { references, toastSuccessMessage, fetchPlan } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.DRAFT);

    const onRequested = () => { this.setState({ isSavingAsDraft: true }); };
    const onSuccess = () => {
      fetchPlan().then(() => {
        this.setState({ isSavingAsDraft: false });
        toastSuccessMessage(strings.SAVE_PLAN_AS_DRAFT_SUCCESS);
      });
    };
    const onError = () => { this.setState({ isSavingAsDraft: false }); };

    this.updateStatusAndContent(status, onRequested, onSuccess, onError);
  }

  onSubmitClicked = () => {
    const { references, toastSuccessMessage, closeConfirmationModal, fetchPlan } = this.props;
    const planStatus = references[REFERENCE_KEY.PLAN_STATUS];
    const status = planStatus.find(s => s.code === PLAN_STATUS.PENDING);

    const onRequested = () => { this.setState({ isSubmitting: true }); };
    const onSuccess = () => {
      fetchPlan().then(() => {
        this.setState({ isSubmitting: false });
        toastSuccessMessage(strings.SUBMIT_PLAN_SUCCESS);
      });
    };
    const onError = () => { this.setState({ isSubmitting: false }); };

    closeConfirmationModal({ modalId: CONFIRMATION_MODAL_ID.SUBMIT_PLAN });
    this.updateStatusAndContent(status, onRequested, onSuccess, onError);
  }

  updateStatusAndContent = async (status, onRequested, onSuccess, onError) => {
    const {
      plan,
      updateRUPStatus,
      createOrUpdateRUPGrazingSchedule,
      grazingSchedulesMap,
      toastErrorMessage,
      ministerIssuesMap,
      createOrUpdateRUPMinisterIssueAndActions,
      createOrUpdateRUPInvasivePlantChecklist,
    } = this.props;

    onRequested();

    const error = this.validateRup(plan);

    if (error) {
      onError();
      return;
    }
    const {
      id: planId,
      grazingSchedules: gsIds,
      ministerIssues: miIds,
      invasivePlantChecklist,
    } = plan;
    const statusId = status && status.id;
    const grazingSchedules = gsIds && gsIds.map(id => grazingSchedulesMap[id]);
    const ministerIssues = miIds && miIds.map(id => ministerIssuesMap[id]);

    try {
      await Promise.all(grazingSchedules.map(schedule => (
        createOrUpdateRUPGrazingSchedule(planId, schedule)
      )));
      await Promise.all(ministerIssues.map(issue => (
        createOrUpdateRUPMinisterIssueAndActions(planId, issue)
      )));
      await createOrUpdateRUPInvasivePlantChecklist(planId, invasivePlantChecklist);
      await updateRUPStatus(planId, statusId, false);
      await onSuccess();
    } catch (err) {
      onError();
      toastErrorMessage(err);
      throw err;
    }
  }

  onAmendPlanClicked = () => {
    const {
      plan,
      createAmendment,
      history,
      toastSuccessMessage,
    } = this.props;

    createAmendment(plan).then((amendment) => {
      toastSuccessMessage(strings.CREATE_AMENDMENT_SUCCESS);
      history.push(`${RANGE_USE_PLAN}/${amendment.id}`);
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
      utils.scrollIntoView(error.elementId);
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
        id: CONFIRMATION_MODAL_ID.SUBMIT_PLAN,
        header: strings.SUBMIT_RUP_CHANGE_CONFIRM_HEADER,
        content: strings.SUBMIT_RUP_CHANGE_CONFIRM_CONTENT,
        onYesBtnClicked: this.onSubmitClicked,
      });
    }
  }

  openSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: true })
  closeSubmitAmendmentModal = () => this.setState({ isSubmitAmendmentModalOpen: false })
  openConfirmAmendmentModal = () => this.setState({ isConfirmAmendmentModalOpen: true })
  closeConfirmAmendmentModal = () => this.setState({ isConfirmAmendmentModalOpen: false })

  renderActionBtns = (canEdit, canAmend, canConfirm, canSubmit) => {
    const { isSavingAsDraft, isSubmitting } = this.state;
    const { isCreatingAmendment } = this.props;

    return (
      <ActionBtns
        canEdit={canEdit}
        canAmend={canAmend}
        canConfirm={canConfirm}
        canSubmit={canSubmit}
        isSavingAsDraft={isSavingAsDraft}
        isSubmitting={isSubmitting}
        isCreatingAmendment={isCreatingAmendment}
        onViewPDFClicked={this.onViewPDFClicked}
        onSaveDraftClick={this.onSaveDraftClick}
        openSubmitConfirmModal={this.openSubmitConfirmModal}
        onAmendPlanClicked={this.onAmendPlanClicked}
        openConfirmAmendmentModal={this.openConfirmAmendmentModal}
      />
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
      planStatusHistoryMap,
      additionalRequirementsMap,
      managementConsiderationsMap,
    } = this.props;

    const { agreementId, status, confirmations, rangeName } = plan;
    const { clients, usage } = agreement;

    const canEdit = utils.canUserEditThisPlan(plan, user);
    const canAmend = utils.isStatusAmongApprovedStatuses(status);
    const canConfirm = utils.canUserSubmitConfirmation(status, user, confirmations, confirmationsMap);
    const canSubmit = utils.isStatusReadyForSubmission(status);
    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const header = utils.getPlanTypeDescription(plan, amendmentTypes);
    const grazingScheduleProps = {
      elementId: ELEMENT_ID.GRAZING_SCHEDULE,
      references,
      usage,
      plan,
      pasturesMap,
      grazingSchedulesMap,
    };
    const ministerIssueProps = {
      elementId: ELEMENT_ID.MINISTER_ISSUES,
      references,
      plan,
      pasturesMap,
      ministerIssuesMap,
    };
    const managementConsiderationProps = {
      elementId: ELEMENT_ID.MANAGEMENT_CONSIDERATIONS,
      plan,
      references,
      managementConsiderationsMap,
    };

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
          content={utils.getBannerContentForAH(plan)}
        />

        <StickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <BackBtn
                className="rup__back-btn"
              />
              <div className="rup__actions__left">
                <div className="rup__actions__title">{agreementId}</div>
                <div className="rup__actions__primary-agreement-holder">{rangeName}</div>
                <Status
                  className="rup__status"
                  status={status}
                  user={user}
                />
              </div>
              <div className="rup__actions__btns">
                {this.renderActionBtns(canEdit, canAmend, canConfirm, canSubmit)}
              </div>
            </div>
          </div>
        </StickyHeader>

        <ContentsContainer>
          <Notifications
            plan={plan}
            user={user}
            references={references}
            confirmationsMap={confirmationsMap}
            planStatusHistoryMap={planStatusHistoryMap}
          />

          <BasicInformation
            elementId={ELEMENT_ID.BASIC_INFORMATION}
            agreement={agreement}
            plan={plan}
            user={user}
          />

          <UsageTable
            usage={usage}
            plan={plan}
          />

          <Pastures
            elementId={ELEMENT_ID.PASTURES}
            plan={plan}
            pasturesMap={pasturesMap}
          />

          {canEdit
            ? <EditableGrazingSchedules {...grazingScheduleProps} />
            : <GrazingSchedules {...grazingScheduleProps} />
          }

          {canEdit
            ? <EditableMinisterIssues {...ministerIssueProps} />
            : <MinisterIssues {...ministerIssueProps} />
          }

          {canEdit
            ? <EditableInvasivePlantChecklist elementId={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST} plan={plan} />
            : <InvasivePlantChecklist elementId={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST} plan={plan} />
          }

          <AdditionalRequirements
            elementId={ELEMENT_ID.ADDITIONAL_REQUIREMENTS}
            plan={plan}
            additionalRequirementsMap={additionalRequirementsMap}
          />

          {canEdit
            ? <EditableManagementConsiderations {...managementConsiderationProps} />
            : <ManagementConsiderations {...managementConsiderationProps} />
          }
        </ContentsContainer>
      </section>
    );
  }
}

export default PageForAH;
