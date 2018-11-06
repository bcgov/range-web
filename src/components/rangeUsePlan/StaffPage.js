import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import UpdateZoneModal from './UpdateZoneModal';
import {
  DETAIL_RUP_BANNER_CONTENT, PREVIEW_PDF,
} from '../../constants/strings';
import { REFERENCE_KEY, ELEMENT_ID } from '../../constants/variables';
import { Status, Banner } from '../common';
import { isStatusDraft, getPlanTypeDescription } from '../../utils';
import BasicInformation from './basicInformation';
import Pastures from './pastures';
import GrazingSchedules from './grazingSchedules';
import MinisterIssues from './ministerIssues';
import BackBtn from './BackBtn';
import ContentsContainer from './ContentsContainer';
import UpdateStatusDropdown from './UpdateStatusDropdown';
import StickyHeader from './StickyHeader';
import { EXPORT_PDF } from '../../constants/routes';
import Notifications from './Notifications';
import UsageTable from './usage';

// Range Staff Page
class StaffPage extends Component {
  static propTypes = {
    agreement: PropTypes.shape({ zone: PropTypes.object }),
    plan: PropTypes.shape({}),
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    grazingSchedulesMap: PropTypes.shape({}).isRequired,
    ministerIssuesMap: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
    planStatusHistoryMap: PropTypes.shape({}).isRequired,
  };

  static defaultProps = {
    agreement: {
      zone: {},
      usage: [],
    },
    plan: {
      agreementId: '',
      pastures: [],
      grazingSchedules: [],
      ministerIssues: [],
      confirmations: [],
      planStatusHistory: [],
    },
  };

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
                {!isStatusDraft(status) &&
                  <Button
                    onClick={this.onViewPDFClicked}
                  >
                    {PREVIEW_PDF}
                  </Button>
                }
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
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            user={user}
            onZoneClicked={this.openUpdateZoneModal}
          />

          <UsageTable
            className="rup__usage__table"
            usage={usage}
            plan={plan}
          />

          <Pastures
            elementId={ELEMENT_ID.PASTURES}
            className="rup__pastures__container"
            plan={plan}
            pasturesMap={pasturesMap}
          />

          <GrazingSchedules
            elementId={ELEMENT_ID.GRAZING_SCHEDULE}
            className="rup__grazing-schedules__container"
            references={references}
            usage={usage}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
          />

          <MinisterIssues
            elementId={ELEMENT_ID.MINISTER_ISSUES}
            className="rup__missues__container"
            references={references}
            plan={plan}
            pasturesMap={pasturesMap}
            ministerIssuesMap={ministerIssuesMap}
          />
        </ContentsContainer>
      </section>
    );
  }
}

export default StaffPage;
