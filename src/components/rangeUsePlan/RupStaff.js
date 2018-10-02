import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import UpdateAgreementZoneModal from './UpdateAgreementZoneModal';
import {
  DETAIL_RUP_BANNER_CONTENT, PREVIEW_PDF,
} from '../../constants/strings';
import { REFERENCE_KEY, ELEMENT_ID } from '../../constants/variables';
import { Status, Banner } from '../common';
import { getAgreementHolders, isStatusDraft, getPlanTypeDescription } from '../../utils';
import ViewRupBasicInformation from './view/ViewRupBasicInformation';
import ViewRupPastures from './view/ViewRupPastures';
import ViewRupGrazingSchedules from './view/ViewRupGrazingSchedules';
import ViewRupMinisterIssues from './view/ViewRupMinisterIssues';
import RupBackBtn from './RupBackBtn';
import RupContents from './RupContents';
import UpdateStatusDropdown from './UpdateStatusDropdown';
import { EXPORT_PDF } from '../../constants/routes';
import RupNotifications from './RupNotifications';

class RupStaff extends Component {
  static propTypes = {
    agreement: PropTypes.shape({ zone: PropTypes.object }),
    plan: PropTypes.shape({}),
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    pasturesMap: PropTypes.shape({}).isRequired,
    grazingSchedulesMap: PropTypes.shape({}).isRequired,
    ministerIssuesMap: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
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
    } = this.props;
    const {
      isUpdateZoneModalOpen,
    } = this.state;

    const { agreementId, status } = plan;
    const { clients, usage } = agreement;
    const { primaryAgreementHolder } = getAgreementHolders(clients);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    const amendmentTypes = references[REFERENCE_KEY.AMENDMENT_TYPE];
    const planTypeDescription = getPlanTypeDescription(plan, amendmentTypes);

    return (
      <section className="rup">
        <UpdateAgreementZoneModal
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

        <div className="rup__sticky">
          <div className="rup__actions__background">
            <div className="rup__actions__container">
              <RupBackBtn
                className="rup__back-btn"
              />
              <div className="rup__actions__left">
                <div className="rup__actions__title">{agreementId}</div>
                <div className="rup__actions__primary-agreement-holder">{primaryAgreementHolderName}</div>
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
        </div>

        <RupContents>
          <RupNotifications
            plan={plan}
            user={user}
            confirmationsMap={confirmationsMap}
            planTypeDescription={planTypeDescription}
          />

          <ViewRupBasicInformation
            elementId={ELEMENT_ID.BASIC_INFORMATION}
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            user={user}
            onZoneClicked={this.openUpdateZoneModal}
          />

          <ViewRupPastures
            elementId={ELEMENT_ID.PASTURES}
            className="rup__pastures__container"
            plan={plan}
            pasturesMap={pasturesMap}
          />

          <ViewRupGrazingSchedules
            elementId={ELEMENT_ID.GRAZING_SCHEDULE}
            className="rup__grazing-schedules__container"
            references={references}
            usage={usage}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
          />

          <ViewRupMinisterIssues
            elementId={ELEMENT_ID.MINISTER_ISSUES}
            className="rup__missues__container"
            references={references}
            plan={plan}
            pasturesMap={pasturesMap}
            ministerIssuesMap={ministerIssuesMap}
          />
        </RupContents>
      </section>
    );
  }
}

export default RupStaff;
