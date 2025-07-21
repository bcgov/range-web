import React, { Component } from 'react';
import {
  REFERENCE_KEY,
  PLAN_STATUS,
  AMENDMENT_TYPE,
  CONFIRMATION_MODAL_ID,
  PLAN_EXTENSION_STATUS,
  ELEMENT_ID,
} from '../../../constants/variables';
import { Status, Banner } from '../../common';
import * as strings from '../../../constants/strings';
import * as utils from '../../../utils';
import BackBtn from '../BackBtn';
import ContentsContainer from '../ContentsContainer';
import StickyHeader from '../StickyHeader';
import Notifications from '../notifications';
import { defaultProps, propTypes } from './props';
import ActionBtns from '../ActionBtns';
import UpdateStatusModal from './UpdateStatusModal';
import PlanForm from '../PlanForm';
import { canUserEditThisPlan, isPlanAmendment } from '../../../utils';
import { createAmendment, savePlan, updatePlan } from '../../../api';
import NetworkStatus from '../../common/NetworkStatus';
import { connect } from 'formik';
import { toastErrorMessage, toastSuccessMessage } from '../../../actionCreators';

// Range Staff Page
class PageForStaff extends Component {
  static propTypes = propTypes;
  static defaultProps = defaultProps;

  state = {
    isPlanSubmissionModalOpen: false,
    isSavingAsDraft: false,
    isCreatingAmendment: false,
  };

  onSaveDraftClick = () => {
    const onRequested = () => {
      this.setState({ isSavingAsDraft: true });
    };
    const onSuccess = () => {
      this.props.fetchPlan().then(() => {
        this.setState({ isSavingAsDraft: false });
        this.props.toastSuccessMessage(strings.STAFF_SAVE_PLAN_DRAFT_SUCCESS);
      });
    };
    const onError = () => {
      this.setState({ isSavingAsDraft: false });
    };

    this.updateContent(onRequested, onSuccess, onError);
  };

  updateContent = async (onRequested, onSuccess, onError) => {
    const { plan, toastErrorMessage, user } = this.props;

    onRequested();

    if (this.validateRup(plan)) return onError();

    try {
      await savePlan(plan, user);

      await onSuccess();
    } catch (err) {
      onError();
      toastErrorMessage(err);
      throw err;
    }
  };

  validateRup = (plan) => {
    const { references, agreement } = this.props;
    const { pastures } = plan;
    const usage = agreement && agreement.usage;
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE];
    const errors = utils.handleRupValidation(plan, pastures, livestockTypes, usage);

    // errors have been found
    if (errors.length !== 0) {
      const [error] = errors;
      utils.scrollIntoView(error.elementId);
      return error;
    }

    // no errors found
    return false;
  };

  validateMapAttachment = (plan, user) => {
    // Check if user is Staff Agrologist or Admin
    if (!utils.isUserAgrologist(user) && !utils.isUserAdmin(user)) {
      return false;
    }

    // Check if plan has map attachments
    const mapAttachments = plan.files?.filter((file) => file.type === 'mapAttachments') || [];

    if (mapAttachments.length === 0) {
      return {
        error: true,
        message: 'Cannot submit a plan without a map attachment. Please upload a map attachment before submitting.',
        elementId: ELEMENT_ID.ATTACHMENTS,
      };
    }
    return false;
  };

  onViewPDFClicked = () => {
    const { id: planId } = this.props.plan || {};
    this.props.history.push(`/range-use-plan/${planId}/export-pdf`);
  };

  onManageAgentsClicked = () => {
    const { id: planId } = this.props.plan || [];
    this.props.history.push(`/range-use-plan/${planId}/agents`);
  };

  onAmendPlanClicked = async () => {
    const { plan, fetchPlan, toastSuccessMessage, toastErrorMessage, references } = this.props;

    this.setState({
      isCreatingAmendment: true,
    });

    try {
      const amendmentType = references[REFERENCE_KEY.AMENDMENT_TYPE]?.find(
        (type) => type.code === AMENDMENT_TYPE.MANDATORY,
      );

      await createAmendment(plan, references, true);
      await updatePlan(plan.id, {
        amendmentTypeId: amendmentType.id,
      });

      toastSuccessMessage(strings.CREATE_AMENDMENT_SUCCESS);
    } catch (e) {
      toastErrorMessage(`Couldn't create amendment: ${e.message}`);
    } finally {
      this.setState({
        isCreatingAmendment: false,
      });

      await fetchPlan();
    }
  };

  openPlanSubmissionModal = () => {
    const error = this.validateRup(this.props.plan);
    if (error) {
      this.props.toastErrorMessage(error);
      return;
    }

    // Check if Staff Agrologist is trying to submit without map attachment
    const mapAttachmentError = this.validateMapAttachment(this.props.plan, this.props.user);
    if (mapAttachmentError) {
      this.props.toastErrorMessage(mapAttachmentError);
      utils.scrollIntoView(mapAttachmentError.elementId);
      return;
    }

    this.setState({ isPlanSubmissionModalOpen: true });
  };
  closePlanSubmissionModal = () => this.setState({ isPlanSubmissionModalOpen: false });

  renderActionBtns = () => {
    const { isSavingAsDraft, isSubmitting } = this.state;
    const { openConfirmationModal, plan, user } = this.props;

    return (
      <ActionBtns
        permissions={{
          edit: utils.canUserSaveDraft(plan, user),
          submit: utils.canUserSubmitPlan(plan, user),
          amend: utils.canUserAmendPlan(plan, user),
          discard: utils.canUserDiscardAmendment(plan, user),
          updateStatus: utils.canUserUpdateStatus(plan, user),
          submitAsMandatory: utils.canUserSubmitAsMandatory(plan, user),
          amendFromLegal: utils.canUserAmendFromLegal(plan, user),
          manageAgents: utils.doesStaffOwnPlan(plan, user),
        }}
        isSubmitting={isSubmitting}
        isSavingAsDraft={isSavingAsDraft}
        isFetchingPlan={this.props.isFetchingPlan}
        isCreatingAmendment={this.state.isCreatingAmendment}
        onViewPDFClicked={this.onViewPDFClicked}
        onManageAgentsClicked={this.onManageAgentsClicked}
        onSaveDraftClick={this.onSaveDraftClick}
        onSubmit={this.openPlanSubmissionModal}
        onAmend={() =>
          openConfirmationModal({
            id: CONFIRMATION_MODAL_ID.AMEND_PLAN,
            header: strings.AMEND_PLAN_CONFIRM_HEADER,
            content: strings.AMEND_PLAN_CONFIRM_CONTENT,
            onYesBtnClicked: this.onAmendPlanClicked,
            closeAfterYesBtnClicked: true,
          })
        }
        user={this.props.user}
        plan={this.props.plan}
        fetchPlan={this.props.fetchPlan}
        beforeUpdateStatus={async (statusCode) => {
          const { formik } = this.props;
          await formik.submitForm();
          const errors = await formik.validateForm();
          const error = this.validateRup(this.props.plan);

          if (Object.keys(errors).length === 0 && !error) {
            return true;
          }

          if (error && !(error.elementId === 'grazing_schedule' && statusCode === PLAN_STATUS.STAFF_DRAFT)) {
            this.props.toastErrorMessage(error);
            return false;
          }
          return true;
        }}
      />
    );
  };

  render() {
    const { user, clientAgreements, references, plan, planStatusHistoryMap, fetchPlan, updateRUPStatus } = this.props;
    const { isPlanSubmissionModalOpen } = this.state;

    const { agreementId, status, rangeName } = plan;

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const planTypeDescription = utils.getPlanTypeDescription(plan, amendmentTypes);
    const { header: bannerHeader, content: bannerContent } = utils.getBannerHeaderAndContentForAH(
      plan,
      user,
      references,
    );

    return (
      <section className="rup">
        <UpdateStatusModal
          open={isPlanSubmissionModalOpen}
          onClose={this.closePlanSubmissionModal}
          plan={plan}
          statusCode={PLAN_STATUS['CREATED']}
          fetchPlan={fetchPlan}
          updateRUPStatus={updateRUPStatus}
          references={references}
          header={strings.SUBMIT_PLAN_CONFIRM_HEADER}
          content={strings.SUBMIT_PLAN_CONFIRM_CONTENT}
        />
        <Banner
          header={bannerHeader}
          content={bannerContent}
          noDefaultHeight
          isReplacementPlan={
            plan.replacementOf != null && plan.extensionStatus !== PLAN_EXTENSION_STATUS.ACTIVE_REPLACEMENT_PLAN
          }
        />

        <StickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <div className="rup__actions__left">
                <BackBtn className="rup__back-btn" agreementId={agreementId} />
                <div>{agreementId}</div>
                <Status status={status} user={user} isAmendment={isPlanAmendment(plan)} />
                <NetworkStatus planId={plan.id} />
                <div>{utils.capitalize(rangeName)}</div>
              </div>
              <div className="rup__actions__btns">{this.renderActionBtns()}</div>
            </div>
          </div>
        </StickyHeader>

        <ContentsContainer plan={plan}>
          <Notifications
            plan={plan}
            user={user}
            clientAgreements={clientAgreements}
            references={references}
            planStatusHistoryMap={planStatusHistoryMap}
            planTypeDescription={planTypeDescription}
          />

          {plan && (
            <PlanForm
              plan={plan}
              fetchPlan={fetchPlan}
              toastSuccessMessage={toastSuccessMessage}
              toastErrorMessage={toastErrorMessage}
              isEditable={canUserEditThisPlan(plan, user)}
            />
          )}
        </ContentsContainer>
      </section>
    );
  }
}

export default connect(PageForStaff);
