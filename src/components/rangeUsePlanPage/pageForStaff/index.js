import React, { Component } from 'react'
import UpdateZoneModal from './UpdateZoneModal'
import { REFERENCE_KEY, PLAN_STATUS } from '../../../constants/variables'
import { Status, Banner } from '../../common'
import * as strings from '../../../constants/strings'
import * as utils from '../../../utils'
import BackBtn from '../BackBtn'
import * as API from '../../../constants/api'
import ContentsContainer from '../ContentsContainer'
import StickyHeader from '../StickyHeader'
import Notifications from '../notifications'
import { defaultProps, propTypes } from './props'
import ActionBtns from '../ActionBtns'
import UpdateStatusModal from './UpdateStatusModal'
import PlanForm from '../PlanForm'
import RUPSchema from '../schema'
import { getAuthHeaderConfig, canUserEditThisPlan } from '../../../utils'
import {
  savePastures,
  savePlantCommunities,
  saveGrazingSchedules,
  saveInvasivePlantChecklist,
  saveManagementConsiderations,
  saveMinisterIssues,
  saveAdditionalRequirements
} from '../../../api'

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

    const {
      pastures,
      grazingSchedules,
      invasivePlantChecklist,
      managementConsiderations,
      ministerIssues,
      additionalRequirements
    } = RUPSchema.cast(plan)

    onRequested()

    const config = getAuthHeaderConfig()

    if (this.validateRup(plan)) return onError()

    try {
      // Update Plan
      // TODO: replace with single function to save plan
      await utils.axios.put(API.UPDATE_RUP(plan.id), plan, config)

      const newPastures = await savePastures(plan.id, pastures)

      await Promise.all(
        newPastures.map(async pasture => {
          await savePlantCommunities(
            plan.id,
            pasture.id,
            pasture.plantCommunities
          )
        })
      )

      await saveGrazingSchedules(plan.id, grazingSchedules)
      await saveInvasivePlantChecklist(plan.id, invasivePlantChecklist)
      await saveManagementConsiderations(plan.id, managementConsiderations)
      await saveMinisterIssues(plan.id, ministerIssues, newPastures)
      await saveAdditionalRequirements(plan.id, additionalRequirements)

      await onSuccess()
    } catch (err) {
      onError()
      toastErrorMessage(err)
      throw err
    }
  }

  validateRup = plan => {
    const { references, agreement, pasturesMap } = this.props
    const usage = agreement && agreement.usage
    const livestockTypes = references[REFERENCE_KEY.LIVESTOCK_TYPE]
    const errors = utils.handleRupValidation(
      plan,
      pasturesMap,
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

  openUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: true })
  closeUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: false })
  openPlanSubmissionModal = () =>
    this.setState({ isPlanSubmissionModalOpen: true })
  closePlanSubmissionModal = () =>
    this.setState({ isPlanSubmissionModalOpen: false })

  renderActionBtns = (canEdit, canSubmit) => {
    const { isSavingAsDraft, isSubmitting } = this.state

    return (
      <ActionBtns
        canEdit={canEdit}
        canSubmit={canSubmit}
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

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
    const planTypeDescription = utils.getPlanTypeDescription(
      plan,
      amendmentTypes
    )
    const {
      header: bannerHeader,
      content: bannerContent
    } = utils.getBannerHeaderAndContentForAH(plan, user)

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
                <BackBtn className="rup__back-btn" />
                <div>{agreementId}</div>
                <Status status={status} user={user} />
                <div>{utils.capitalize(rangeName)}</div>
              </div>
              <div className="rup__actions__btns">
                {this.renderActionBtns(canEdit, canSubmit)}
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
