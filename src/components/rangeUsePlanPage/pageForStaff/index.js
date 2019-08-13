import React, { Component } from 'react'
import UpdateZoneModal from './UpdateZoneModal'
import {
  REFERENCE_KEY,
  ELEMENT_ID,
  PLAN_STATUS
} from '../../../constants/variables'
import { Status, Banner } from '../../common'
import * as strings from '../../../constants/strings'
import * as utils from '../../../utils'
import BasicInformation from '../basicInformation'
import EditableBasicInformation from '../editableBasicInformation'
import Pastures from '../pastures'
import GrazingSchedules from '../grazingSchedules'
import MinisterIssues from '../ministerIssues'
import BackBtn from '../BackBtn'
import ContentsContainer from '../ContentsContainer'
import UpdateStatusDropdown from './UpdateStatusDropdown'
import StickyHeader from '../StickyHeader'
import { EXPORT_PDF } from '../../../constants/routes'
import Notifications from '../notifications'
import UsageTable from '../usage'
import InvasivePlantChecklist from '../invasivePlantChecklist'
import AdditionalRequirements from '../additionalRequirements'
import ManagementConsiderations from '../managementConsiderations'
import { defaultProps, propTypes } from './props'
import ActionBtns from '../ActionBtns'
import UpdateStatusModal from './UpdateStatusModal'

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
    const { plan, updateRUP, toastErrorMessage } = this.props

    onRequested()

    if (this.validateRup(plan)) return onError()

    try {
      await updateRUP(plan.id, plan)
      await onSuccess()
    } catch (err) {
      onError()
      toastErrorMessage(err)
      throw err
    }
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
        onSaveDraftClick={this.onSaveDraftClick}
        openSubmissionModal={this.openPlanSubmissionModal}
      />
    )
  }

  render() {
    const {
      agreement,
      user,
      references,
      plan,
      pasturesMap,
      grazingSchedulesMap,
      ministerIssuesMap,
      confirmationsMap,
      planStatusHistoryMap,
      additionalRequirementsMap,
      managementConsiderationsMap,
      fetchPlan,
      isFetchingPlan,
      updateRUPStatus
    } = this.props
    const { isUpdateZoneModalOpen, isPlanSubmissionModalOpen } = this.state

    const { agreementId, status, rangeName } = plan
    const { usage } = agreement

    const canEdit = utils.canUserEditThisPlan(plan, user)
    const canSubmit = utils.isStatusRecommendForSubmission(status)

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
                <UpdateStatusDropdown
                  plan={plan}
                  fetchPlan={fetchPlan}
                  isFetchingPlan={isFetchingPlan}
                />
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
            planTypeDescription={planTypeDescription}
          />

          {canEdit ? (
            <EditableBasicInformation
              elementId={ELEMENT_ID.BASIC_INFORMATION}
              agreement={agreement}
              plan={plan}
              user={user}
              onZoneClicked={this.openUpdateZoneModal}
            />
          ) : (
            <BasicInformation
              elementId={ELEMENT_ID.BASIC_INFORMATION}
              agreement={agreement}
              plan={plan}
              user={user}
              onZoneClicked={this.openUpdateZoneModal}
            />
          )}

          <UsageTable usage={usage} plan={plan} />

          <Pastures
            elementId={ELEMENT_ID.PASTURES}
            plan={plan}
            pasturesMap={pasturesMap}
          />

          <GrazingSchedules
            elementId={ELEMENT_ID.GRAZING_SCHEDULE}
            references={references}
            usage={usage}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
          />

          <MinisterIssues
            elementId={ELEMENT_ID.MINISTER_ISSUES}
            references={references}
            plan={plan}
            pasturesMap={pasturesMap}
            ministerIssuesMap={ministerIssuesMap}
          />

          <InvasivePlantChecklist
            elementId={ELEMENT_ID.INVASIVE_PLANT_CHECKLIST}
            plan={plan}
          />

          <AdditionalRequirements
            elementId={ELEMENT_ID.ADDITIONAL_REQUIREMENTS}
            plan={plan}
            additionalRequirementsMap={additionalRequirementsMap}
          />

          <ManagementConsiderations
            elementId={ELEMENT_ID.MANAGEMENT_CONSIDERATIONS}
            plan={plan}
            managementConsiderationsMap={managementConsiderationsMap}
          />
        </ContentsContainer>
      </section>
    )
  }
}

export default PageForStaff
