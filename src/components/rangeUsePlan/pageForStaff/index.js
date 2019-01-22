import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';
import UpdateZoneModal from '../UpdateZoneModal';
import { DETAIL_RUP_BANNER_CONTENT, DOWNLOAD_PDF } from '../../../constants/strings';
import { REFERENCE_KEY, ELEMENT_ID } from '../../../constants/variables';
import { Status, Banner } from '../../common';
import { getPlanTypeDescription, cannotDownloadPDF } from '../../../utils';
import BasicInformation from '../basicInformation';
import Pastures from '../pastures';
import GrazingSchedules from '../grazingSchedules';
import MinisterIssues from '../ministerIssues';
import BackBtn from '../BackBtn';
import ContentsContainer from '../ContentsContainer';
import UpdateStatusDropdown from '../UpdateStatusDropdown';
import StickyHeader from '../StickyHeader';
import { EXPORT_PDF } from '../../../constants/routes';
import Notifications from '../Notifications';
import UsageTable from '../usage';
import InvasivePlantChecklist from '../invasivePlantChecklist';
import AdditionalRequirements from '../additionalRequirements';
import ManagementConsiderations from '../managementConsiderations';
import { defaultProps, propTypes } from './props';

// Range Staff Page
class PageForStaff extends Component {
  static propTypes = propTypes;

  static defaultProps = defaultProps;

  state = {
    isUpdateZoneModalOpen: false,
  }

  onViewPDFClicked = () => {
    const { id: planId, agreementId } = this.props.plan || {};
    window.open(`${EXPORT_PDF}/${agreementId}/${planId}`, '_blank');
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
    } = this.props;
    const {
      isUpdateZoneModalOpen,
    } = this.state;

    const { agreementId, status, rangeName } = plan;
    const { usage } = agreement;

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const planTypeDescription = getPlanTypeDescription(plan, amendmentTypes);

    return (
      <section className="rup">
        <UpdateZoneModal
          isUpdateZoneModalOpen={isUpdateZoneModalOpen}
          closeUpdateZoneModal={this.closeUpdateZoneModal}
          plan={plan}
          agreement={agreement}
        />

        <Banner
          header={planTypeDescription}
          content={DETAIL_RUP_BANNER_CONTENT}
          noDefaultHeight
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
                <Button
                  disabled={cannotDownloadPDF(status)}
                  onClick={this.onViewPDFClicked}
                >
                  {DOWNLOAD_PDF}
                </Button>
                <UpdateStatusDropdown
                  plan={plan}
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

          <UsageTable
            usage={usage}
            plan={plan}
          />

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
    );
  }
}

export default PageForStaff;
