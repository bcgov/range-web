import React, { Component } from 'react'
import {
  PLAN_STATUS,
  REFERENCE_KEY,
  CONFIRMATION_MODAL_ID
} from '../../../constants/variables'
import * as strings from '../../../constants/strings'
import * as utils from '../../../utils'
import { Status, Banner } from '../../common'
import ContentsContainer from '../ContentsContainer'
import BackBtn from '../BackBtn'
import Notifications from '../notifications'
import StickyHeader from '../StickyHeader'
import { defaultProps, propTypes } from './props'
import ActionBtns from '../ActionBtns'
import PlanSubmissionModal from './SubmissionModal'
import AHSignatureModal from './AHSignatureModal'
import AmendmentSubmissionModal from './AmendmentSubmissionModal'
import PlanForm from '../PlanForm'
import { createAmendment, savePlan } from '../../../api'
import { canUserEditThisPlan, isPlanAmendment } from '../../../utils'
import NetworkStatus from '../../common/NetworkStatus'

// Agreement Holder page
class PageForAH extends Component {
  static propTypes = propTypes

  static defaultProps = defaultProps

  state = {
    isAmendmentSubmissionModalOpen: false,
    isPlanSubmissionModalOpen: false,
    isAHSignatureModalOpen: false,
    isSavingAsDraft: false,
    isSubmitting: false,
    isCreatingAmendment: false
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
    const { plan, updateRUPStatus, toastErrorMessage } = this.props

    onRequested()

    const error = this.validateRup(plan)

    if (error) {
      onError()
      return
    }

    try {
      const planId = await savePlan(plan)

      await updateRUPStatus({
        planId,
        statusId: status.id,
        note,
        shouldToast: false
      })
      await onSuccess()
    } catch (err) {
      onError()
      toastErrorMessage(err)
      throw err
    }
  }

  onAmendPlanClicked = () => {
    const { plan, fetchPlan, toastSuccessMessage, references } = this.props

    this.setState({
      isCreatingAmendment: true
    })

    createAmendment(plan, references)
      .then(() => {
        toastSuccessMessage(strings.CREATE_AMENDMENT_SUCCESS)
        return fetchPlan()
      })
      .then(() => {
        this.setState({
          isCreatingAmendment: false
        })
      })
  }

  validateRup = plan => {
    const { references, agreement } = this.props
    const { pastures } = plan
    const usage = agreement && agreement.usage
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE]
    const errors = utils.handleRupValidation(
      plan,
      pastures,
      livestockTypes,
      usage,
      true
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
    const { id: planId } = this.props.plan || {}
    this.props.history.push(`/range-use-plan/${planId}/export-pdf`)
  }

  onViewVersionsClicked = () => {
    const { id: planId } = this.props.plan || {}
    this.props.history.push(`/range-use-plan/${planId}/versions`)
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

  renderActionBtns = () => {
    const { isSavingAsDraft, isSubmitting, isCreatingAmendment } = this.state
    const { openConfirmationModal, plan, user, clientAgreements } = this.props
    const { confirmations, status } = plan

    return (
      <ActionBtns
        permissions={{
          edit: utils.canUserEditThisPlan(plan, user),
          amend: utils.isStatusAmongApprovedStatuses(status),
          confirm: utils.canUserSubmitConfirmation(
            status,
            user,
            confirmations,
            clientAgreements
          ),
          submit: utils.canUserSubmitPlan(plan, user),
          discard: utils.canUserDiscardAmendment(plan, user),
          amendFromLegal: utils.canUserAmendFromLegal(plan, user)
        }}
        isSavingAsDraft={isSavingAsDraft}
        isSubmitting={isSubmitting}
        isCreatingAmendment={isCreatingAmendment}
        onViewPDFClicked={this.onViewPDFClicked}
        onViewVersionsClicked={this.onViewVersionsClicked}
        onSaveDraftClick={this.onSaveDraftClick}
        onAmend={() =>
          openConfirmationModal({
            id: CONFIRMATION_MODAL_ID.AMEND_PLAN,
            header: strings.AMEND_PLAN_CONFIRM_HEADER,
            content: strings.AMEND_PLAN_CONFIRM_CONTENT,
            onYesBtnClicked: this.onAmendPlanClicked,
            closeAfterYesBtnClicked: true
          })
        }
        onSubmit={this.openSubmissionModal}
        onSignSubmission={this.openAHSignatureModal}
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
      clientAgreements,
      user,
      agreement,
      references,
      planStatusHistoryMap,
      fetchPlan
    } = this.props

    const { agreementId, status, rangeName } = plan
    const { clients } = agreement

    const {
      header: bannerHeader,
      content: bannerContent
    } = utils.getBannerHeaderAndContentForAH(plan, user, references)

    return (
      <section className="rup">
        <PlanSubmissionModal
          open={isPlanSubmissionModalOpen}
          onClose={this.closePlanSubmissionModal}
          plan={plan}
          clients={clients}
          clientAgreements={clientAgreements}
          updateStatusAndContent={this.updateStatusAndContent}
          fetchPlan={fetchPlan}
        />

        <AHSignatureModal
          open={isAHSignatureModalOpen}
          onClose={this.closeAHSignatureModal}
          plan={plan}
          clients={clients}
          clientAgreements={clientAgreements}
          updateStatusAndContent={this.updateStatusAndContent}
          fetchPlan={fetchPlan}
          onSuccess={() => fetchPlan()}
          references={references}
        />

        <AmendmentSubmissionModal
          open={isAmendmentSubmissionModalOpen}
          onClose={this.closeAmendmentSubmissionModal}
          plan={plan}
          clients={clients}
          clientAgreements={clientAgreements}
          updateStatusAndContent={this.updateStatusAndContent}
          fetchPlan={fetchPlan}
        />

        <Banner noDefaultHeight header={bannerHeader} content={bannerContent} />

        <StickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <div className="rup__actions__left">
                <BackBtn className="rup__back-btn" agreementId={agreementId} />
                <div>{agreementId}</div>
                <Status
                  status={status}
                  user={user}
                  isAmendment={isPlanAmendment(plan)}
                />
                <NetworkStatus planId={plan.id} />
                <div>{utils.capitalize(rangeName)}</div>
              </div>
              <div className="rup__actions__btns">
                {this.renderActionBtns()}
              </div>
            </div>
          </div>
        </StickyHeader>

        <ContentsContainer>
          <Notifications
            plan={plan}
            user={user}
            clientAgreements={clientAgreements}
            references={references}
            planStatusHistoryMap={planStatusHistoryMap}
          />

          {plan && (
            <PlanForm
              plan={plan}
              isEditable={canUserEditThisPlan(plan, user)}
            />
          )}
        </ContentsContainer>
      </section>
    )
  }
}

export default PageForAH
