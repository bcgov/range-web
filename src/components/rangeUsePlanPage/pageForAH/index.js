import React, { Component } from 'react'
import {
  PLAN_STATUS,
  REFERENCE_KEY,
  ELEMENT_ID
} from '../../../constants/variables'
import { RANGE_USE_PLAN, EXPORT_PDF } from '../../../constants/routes'
import * as strings from '../../../constants/strings'
import * as utils from '../../../utils'
import { Status, Banner } from '../../common'
import ContentsContainer from '../ContentsContainer'
import BackBtn from '../BackBtn'
import Notifications from '../notifications'
import StickyHeader from '../StickyHeader'
import MinisterIssues from '../ministerIssues'
import EditableMinisterIssues from '../editableMinisterIssues'
import AdditionalRequirements from '../additionalRequirements'
import { defaultProps, propTypes } from './props'
import ActionBtns from '../ActionBtns'
import PlanSubmissionModal from './SubmissionModal'
import AHSignatureModal from './AHSignatureModal'
import AmendmentSubmissionModal from './AmendmentSubmissionModal'
import PlanForm from '../PlanForm'

// Agreement Holder page
class PageForAH extends Component {
  static propTypes = propTypes

  static defaultProps = defaultProps

  state = {
    isAmendmentSubmissionModalOpen: false,
    isPlanSubmissionModalOpen: false,
    isAHSignatureModalOpen: false,
    isSavingAsDraft: false,
    isSubmitting: false
  }

  onSaveDraftClick = () => {
    const { references, toastSuccessMessage, fetchPlan } = this.props
    const draft = utils.findStatusWithCode(references, PLAN_STATUS.DRAFT)

    const onRequested = () => {
      this.setState({ isSavingAsDraft: true })
    }
    const onSuccess = () => {
      fetchPlan().then(() => {
        this.setState({ isSavingAsDraft: false })
        toastSuccessMessage(strings.SAVE_PLAN_AS_DRAFT_SUCCESS)
      })
    }
    const onError = () => {
      this.setState({ isSavingAsDraft: false })
    }

    this.updateStatusAndContent(
      { status: draft },
      onRequested,
      onSuccess,
      onError
    )
  }

  updateStatusAndContent = async (
    { status, note },
    onRequested,
    onSuccess,
    onError
  ) => {
    const {
      plan,
      updateRUPStatus,
      createOrUpdateRUPGrazingSchedule,
      grazingSchedulesMap,
      toastErrorMessage,
      ministerIssuesMap,
      managementConsiderationsMap,
      createOrUpdateRUPMinisterIssueAndActions,
      createOrUpdateRUPInvasivePlantChecklist,
      createOrUpdateRUPManagementConsideration
    } = this.props

    onRequested()

    const error = this.validateRup(plan)

    if (error) {
      onError()
      return
    }
    const {
      id: planId,
      grazingSchedules: gsIds,
      ministerIssues: miIds,
      invasivePlantChecklist,
      managementConsiderations: mcIds
    } = plan
    const statusId = status && status.id
    const grazingSchedules = gsIds && gsIds.map(id => grazingSchedulesMap[id])
    const ministerIssues = miIds && miIds.map(id => ministerIssuesMap[id])
    const managementConsiderations =
      mcIds && mcIds.map(id => managementConsiderationsMap[id])

    try {
      await Promise.all(
        grazingSchedules.map(schedule =>
          createOrUpdateRUPGrazingSchedule(planId, schedule)
        )
      )
      await Promise.all(
        ministerIssues.map(issue =>
          createOrUpdateRUPMinisterIssueAndActions(planId, issue)
        )
      )
      await createOrUpdateRUPInvasivePlantChecklist(
        planId,
        invasivePlantChecklist
      )
      await updateRUPStatus({ planId, statusId, note, shouldToast: false })
      await Promise.all(
        managementConsiderations.map(consideration =>
          createOrUpdateRUPManagementConsideration(planId, consideration)
        )
      )
      await onSuccess()
    } catch (err) {
      onError()
      toastErrorMessage(err)
      throw err
    }
  }

  onAmendPlanClicked = () => {
    const { plan, createAmendment, history, toastSuccessMessage } = this.props

    createAmendment(plan).then(amendment => {
      toastSuccessMessage(strings.CREATE_AMENDMENT_SUCCESS)
      history.push(`${RANGE_USE_PLAN}/${amendment.id}`)
    })
  }

  validateRup = plan => {
    const {
      references,
      agreement,
      pasturesMap,
      grazingSchedulesMap
    } = this.props
    const usage = agreement && agreement.usage
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE]
    const errors = utils.handleRupValidation(
      plan,
      pasturesMap,
      grazingSchedulesMap,
      livestockTypes,
      usage
    )

    // errors have been found
    if (errors.length !== 0) {
      const [error] = errors
      utils.scrollIntoView(error.elementId)
      return error
    }

    // no errors found
    return false
  }

  onViewPDFClicked = () => {
    const { id: planId, agreementId } = this.props.plan || {}
    window.open(`${EXPORT_PDF}/${agreementId}/${planId}`, '_blank')
  }

  openSubmissionModal = () => {
    const { plan } = this.props
    const error = this.validateRup(plan)
    if (!error) {
      if (utils.isPlanAmendment(plan)) {
        this.openAmendmentSubmissionModal()
        return
      }

      this.openPlanSubmissionModal()
    }
  }

  openPlanSubmissionModal = () =>
    this.setState({ isPlanSubmissionModalOpen: true })
  closePlanSubmissionModal = () =>
    this.setState({ isPlanSubmissionModalOpen: false })
  openAHSignatureModal = () => this.setState({ isAHSignatureModalOpen: true })
  closeAHSignatureModal = () => this.setState({ isAHSignatureModalOpen: false })
  openAmendmentSubmissionModal = () =>
    this.setState({ isAmendmentSubmissionModalOpen: true })
  closeAmendmentSubmissionModal = () =>
    this.setState({ isAmendmentSubmissionModalOpen: false })

  renderActionBtns = (canEdit, canAmend, canConfirm, canSubmit) => {
    const { isSavingAsDraft, isSubmitting } = this.state
    const { isCreatingAmendment, openConfirmationModal } = this.props

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
        onAmendPlanClicked={this.onAmendPlanClicked}
        openSubmissionModal={this.openSubmissionModal}
        openAHSignatureModal={this.openAHSignatureModal}
        openConfirmationModal={openConfirmationModal}
      />
    )
  }

  render() {
    const {
      isAmendmentSubmissionModalOpen,
      isPlanSubmissionModalOpen,
      isAHSignatureModalOpen
    } = this.state

    const {
      plan,
      user,
      agreement,
      references,
      pasturesMap,
      ministerIssuesMap,
      confirmationsMap,
      planStatusHistoryMap,
      additionalRequirementsMap,
      fetchPlan
    } = this.props

    const { agreementId, status, confirmations, rangeName } = plan
    const { clients } = agreement

    const canEdit = utils.canUserEditThisPlan(plan, user)
    const canAmend = utils.isStatusAmongApprovedStatuses(status)
    const canConfirm = utils.canUserSubmitConfirmation(
      status,
      user,
      confirmations,
      confirmationsMap
    )
    const canSubmit = utils.isStatusRecommendForSubmission(status)
    const {
      header: bannerHeader,
      content: bannerContent
    } = utils.getBannerHeaderAndContentForAH(plan, user)
    // const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    // const header = utils.getPlanTypeDescription(plan, amendmentTypes);
    const ministerIssueProps = {
      elementId: ELEMENT_ID.MINISTER_ISSUES,
      references,
      plan,
      pasturesMap,
      ministerIssuesMap
    }

    return (
      <section className="rup">
        <PlanSubmissionModal
          open={isPlanSubmissionModalOpen}
          onClose={this.closePlanSubmissionModal}
          plan={plan}
          clients={clients}
          updateStatusAndContent={this.updateStatusAndContent}
          fetchPlan={fetchPlan}
        />

        <AHSignatureModal
          open={isAHSignatureModalOpen}
          onClose={this.closeAHSignatureModal}
          plan={plan}
          clients={clients}
          updateStatusAndContent={this.updateStatusAndContent}
          fetchPlan={fetchPlan}
        />

        <AmendmentSubmissionModal
          open={isAmendmentSubmissionModalOpen}
          onClose={this.closeAmendmentSubmissionModal}
          plan={plan}
          clients={clients}
          updateStatusAndContent={this.updateStatusAndContent}
          fetchPlan={fetchPlan}
        />

        <Banner noDefaultHeight header={bannerHeader} content={bannerContent} />

        <StickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <div className="rup__actions__left">
                <BackBtn className="rup__back-btn" />
                <div>{agreementId}</div>
                <Status status={status} user={user} />
                <div>{utils.capitalize(rangeName)}</div>
              </div>
              <div className="rup__actions__btns">
                {this.renderActionBtns(
                  canEdit,
                  canAmend,
                  canConfirm,
                  canSubmit
                )}
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

          {plan && <PlanForm plan={plan} />}

          {canEdit ? (
            <EditableMinisterIssues {...ministerIssueProps} />
          ) : (
            <MinisterIssues issues={plan.ministerIssues} /> //  TODO: these should be populated objects instead of ids
          )}

          <AdditionalRequirements
            elementId={ELEMENT_ID.ADDITIONAL_REQUIREMENTS}
            plan={plan}
            additionalRequirementsMap={additionalRequirementsMap}
          />
        </ContentsContainer>
      </section>
    )
  }
}

export default PageForAH
