import React, { Component } from 'react'
import UpdateZoneModal from './UpdateZoneModal'
import {
  REFERENCE_KEY,
  PLAN_STATUS,
  AMENDMENT_TYPE
} from '../../../constants/variables'
import { Status, Banner } from '../../common'
import * as strings from '../../../constants/strings'
import * as utils from '../../../utils'
import BackBtn from '../BackBtn'
import ContentsContainer from '../ContentsContainer'
import StickyHeader from '../StickyHeader'
import Notifications from '../notifications'
import { defaultProps, propTypes } from './props'
import ActionBtns from '../ActionBtns'
import UpdateStatusModal from './UpdateStatusModal'
import PlanForm from '../PlanForm'
import { canUserEditThisPlan } from '../../../utils'
import { createAmendment, savePlan, updatePlan } from '../../../api'
import NetworkStatus from '../../common/NetworkStatus'

// Range Staff Page
class PageForStaff extends Component {
  static propTypes = propTypes
  static defaultProps = defaultProps

  state = {
    isUpdateZoneModalOpen: false,
    isPlanSubmissionModalOpen: false,
    isSavingAsDraft: false
  }

  onSaveDraftClick = () => {
    const onRequested = () => {
      this.setState({ isSavingAsDraft: true })
    }
    const onSuccess = () => {
      this.props.fetchPlan().then(() => {
        this.setState({ isSavingAsDraft: false })
        this.props.toastSuccessMessage(strings.STAFF_SAVE_PLAN_DRAFT_SUCCESS)
      })
    }
    const onError = () => {
      this.setState({ isSavingAsDraft: false })
    }

    this.updateContent(onRequested, onSuccess, onError)
  }

  updateContent = async (onRequested, onSuccess, onError) => {
    const { plan, toastErrorMessage } = this.props

    onRequested()

    if (this.validateRup(plan)) return onError()

    try {
      await savePlan(plan)

      await onSuccess()
    } catch (err) {
      onError()
      toastErrorMessage(err)
      throw err
    }
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
    const { id: planId } = this.props.plan || {}
    this.props.history.push(`/range-use-plan/${planId}/export-pdf`)
  }

  onViewVersionsClicked = () => {
    const { id: planId } = this.props.plan || {}
    this.props.history.push(`/range-use-plan/${planId}/versions`)
  }

  onAmendPlanClicked = async () => {
    const {
      plan,
      fetchPlan,
      toastSuccessMessage,
      toastErrorMessage,
      references
    } = this.props

    this.setState({
      isCreatingAmendment: true
    })

    try {
      const amendmentType = references[REFERENCE_KEY.AMENDMENT_TYPE]?.find(
        type => type.code === AMENDMENT_TYPE.MANDATORY
      )

      await createAmendment(plan, references, true)
      await updatePlan(plan.id, {
        amendmentTypeId: amendmentType.id
      })

      toastSuccessMessage(strings.CREATE_AMENDMENT_SUCCESS)
    } catch (e) {
      toastErrorMessage(`Couldn't create amendment: ${e.message}`)
    } finally {
      this.setState({
        isCreatingAmendment: false
      })

      await fetchPlan()
    }
  }

  openUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: true })
  closeUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: false })
  openPlanSubmissionModal = () => {
    const error = this.validateRup(this.props.plan)
    if (!error) {
      this.setState({ isPlanSubmissionModalOpen: true })
    } else {
      this.props.toastErrorMessage(error)
    }
  }
  closePlanSubmissionModal = () =>
    this.setState({ isPlanSubmissionModalOpen: false })

  renderActionBtns = (canEdit, canSubmit, canAmend, canDiscard) => {
    const { isSavingAsDraft, isSubmitting } = this.state
    const { openConfirmationModal } = this.props

    return (
      <ActionBtns
        canEdit={canEdit}
        canSubmit={canSubmit}
        canAmend={canAmend}
        canDiscard={canDiscard}
        isSubmitting={isSubmitting}
        isSavingAsDraft={isSavingAsDraft}
        onViewPDFClicked={this.onViewPDFClicked}
        onViewVersionsClicked={this.onViewVersionsClicked}
        onSaveDraftClick={this.onSaveDraftClick}
        openSubmissionModal={this.openPlanSubmissionModal}
        plan={this.props.plan}
        isFetchingPlan={this.props.isFetchingPlan}
        fetchPlan={this.props.fetchPlan}
        canUpdateStatus
        openConfirmationModal={openConfirmationModal}
        onAmendPlanClicked={this.onAmendPlanClicked}
        beforeUpdateStatus={async () => {
          await savePlan(this.props.plan)
          await this.props.fetchPlan()

          const error = this.validateRup(this.props.plan)

          if (error) {
            this.props.toastErrorMessage(error)
            return false
          }

          return true
        }}
      />
    )
  }

  render() {
    const {
      agreement,
      user,
      references,
      plan,
      planStatusHistoryMap,
      fetchPlan,
      updateRUPStatus
    } = this.props
    const { isUpdateZoneModalOpen, isPlanSubmissionModalOpen } = this.state

    const { agreementId, status, rangeName } = plan

    const canEdit = utils.canUserEditThisPlan(plan, user)
    const canSubmit = utils.canUserSubmitPlan(plan, user)
    const canAmend = utils.isStatusAmongApprovedStatuses(status)
    const canDiscard = utils.canUserDiscardAmendment(plan, user)

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
    const planTypeDescription = utils.getPlanTypeDescription(
      plan,
      amendmentTypes
    )
    const {
      header: bannerHeader,
      content: bannerContent
    } = utils.getBannerHeaderAndContentForAH(plan, user, references)

    return (
      <section className="rup">
        <UpdateZoneModal
          isUpdateZoneModalOpen={isUpdateZoneModalOpen}
          closeUpdateZoneModal={this.closeUpdateZoneModal}
          plan={plan}
          agreement={agreement}
        />

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

        <Banner header={bannerHeader} content={bannerContent} noDefaultHeight />

        <StickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <div className="rup__actions__left">
                <BackBtn className="rup__back-btn" agreementId={agreementId} />
                <div>{agreementId}</div>
                <Status
                  status={status}
                  user={user}
                  amendmentTypeId={plan.amendmentTypeId}
                />
                <NetworkStatus planId={plan.id} />
                <div>{utils.capitalize(rangeName)}</div>
              </div>
              <div className="rup__actions__btns">
                {this.renderActionBtns(
                  canEdit,
                  canSubmit,
                  canAmend,
                  canDiscard
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
            planStatusHistoryMap={planStatusHistoryMap}
            planTypeDescription={planTypeDescription}
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

export default PageForStaff
