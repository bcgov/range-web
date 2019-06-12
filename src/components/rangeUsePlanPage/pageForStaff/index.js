import React, { Component } from 'react'
import UpdateZoneModal from './UpdateZoneModal'
import { REFERENCE_KEY, ELEMENT_ID } from '../../../constants/variables'
import { Status, Banner } from '../../common'
import {
  getPlanTypeDescription,
  cannotDownloadPDF,
  capitalize,
  getBannerHeaderAndContentForAH
} from '../../../utils'
import BasicInformation from '../basicInformation'
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
import DownloadPDFBtn from '../DownloadPDFBtn'

// Range Staff Page
class PageForStaff extends Component {
  static propTypes = propTypes

  static defaultProps = defaultProps

  state = {
    isUpdateZoneModalOpen: false
  }

  onViewPDFClicked = () => {
    const { id: planId, agreementId } = this.props.plan || {}
    window.open(`${EXPORT_PDF}/${agreementId}/${planId}`, '_blank')
  }

  openUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: true })
  closeUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: false })

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
      isFetchingPlan
    } = this.props
    const { isUpdateZoneModalOpen } = this.state

    const { agreementId, status, rangeName } = plan
    const { usage } = agreement

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE]
    const planTypeDescription = getPlanTypeDescription(plan, amendmentTypes)
    const {
      header: bannerHeader,
      content: bannerContent
    } = getBannerHeaderAndContentForAH(plan, user)

    return (
      <section className="rup">
        <UpdateZoneModal
          isUpdateZoneModalOpen={isUpdateZoneModalOpen}
          closeUpdateZoneModal={this.closeUpdateZoneModal}
          plan={plan}
          agreement={agreement}
        />

        <Banner header={bannerHeader} content={bannerContent} noDefaultHeight />

        <StickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <div className="rup__actions__left">
                <BackBtn className="rup__back-btn" />
                <div>{agreementId}</div>
                <Status status={status} user={user} />
                <div>{capitalize(rangeName)}</div>
              </div>
              <div className="rup__actions__btns">
                <DownloadPDFBtn
                  disabled={cannotDownloadPDF(status)}
                  onClick={this.onViewPDFClicked}
                />
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

          <BasicInformation
            elementId={ELEMENT_ID.BASIC_INFORMATION}
            agreement={agreement}
            plan={plan}
            user={user}
            onZoneClicked={this.openUpdateZoneModal}
          />

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
