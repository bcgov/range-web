import React, { Component } from 'react'
import UpdateZoneModal from './UpdateZoneModal'
import {
  REFERENCE_KEY,
  PLAN_STATUS,
  AMENDMENT_TYPE,
  CONFIRMATION_MODAL_ID
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
import { canUserEditThisPlan, isPlanAmendment } from '../../../utils'
import { createAmendment, savePlan, updatePlan } from '../../../api'
import NetworkStatus from '../../common/NetworkStatus'

// Range Staff Page
class PageForStaff extends Component {
  static propTypes = propTypes
  static defaultProps = defaultProps

  state = {
    isUpdateZoneModalOpen: false,
    isPlanSubmissionModalOpen: false,
    isSavingAsDraft: false,
    isCreatingAmendment: false
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

  onManageAgentsClicked = () => {
    const { id: planId } = this.props.plan || []
    this.props.history.push(`/range-use-plan/${planId}/agents`)
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

  renderActionBtns = () => {
    const { isSavingAsDraft, isSubmitting } = this.state
    const { openConfirmationModal, plan, user } = this.props

    return (
      <ActionBtns
        permissions={{
          edit: utils.canUserEditThisPlan(plan, user),
          submit: utils.canUserSubmitPlan(plan, user),
          amend: utils.canUserAmendPlan(plan, user),
          discard: utils.canUserDiscardAmendment(plan, user),
          updateStatus: utils.doesStaffOwnPlan(plan, user),
          submitAsMandatory: utils.canUserSubmitAsMandatory(plan, user),
          amendFromLegal: utils.canUserAmendFromLegal(plan, user),
          manageAgents: utils.doesStaffOwnPlan(plan, user)
        }}
        isSubmitting={isSubmitting}
        isSavingAsDraft={isSavingAsDraft}
        isFetchingPlan={this.props.isFetchingPlan}
        isCreatingAmendment={this.state.isCreatingAmendment}
        onViewPDFClicked={this.onViewPDFClicked}
        onViewVersionsClicked={this.onViewVersionsClicked}
        onManageAgentsClicked={this.onManageAgentsClicked}
        onSaveDraftClick={this.onSaveDraftClick}
        onSubmit={this.openPlanSubmissionModal}
        onAmend={() =>
          openConfirmationModal({
            id: CONFIRMATION_MODAL_ID.AMEND_PLAN,
            header: strings.AMEND_PLAN_CONFIRM_HEADER,
            content: strings.AMEND_PLAN_CONFIRM_CONTENT,
            onYesBtnClicked: this.onAmendPlanClicked,
            closeAfterYesBtnClicked: true
          })
        }
        plan={this.props.plan}
        fetchPlan={this.props.fetchPlan}
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
      clientAgreements,
      references,
      plan,
      planStatusHistoryMap,
      fetchPlan,
      updateRUPStatus
    } = this.props
    const { isUpdateZoneModalOpen, isPlanSubmissionModalOpen } = this.state

    const { agreementId, status, rangeName } = plan

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
