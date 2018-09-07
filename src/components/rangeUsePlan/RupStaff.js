import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import UpdateAgreementZoneModal from './UpdateAgreementZoneModal';
import {
  DETAIL_RUP_BANNER_CONTENT, PREVIEW_PDF,
} from '../../constants/strings';
import { REFERENCE_KEY } from '../../constants/variables';
import { Status, Banner } from '../common';
import { getAgreementHolders, isStatusDraft, getPlanTypeDescription, isStatusIndicatingStaffFeedbackNeeded } from '../../utils';
import RupBasicInformation from './view/RupBasicInformation';
import RupPastures from './view/RupPastures';
import RupGrazingSchedules from './view/RupGrazingSchedules';
import RupMinisterIssues from './view/RupMinisterIssues';
import RupStickyHeader from './RupStickyHeader';
import UpdateStatusDropdown from './UpdateStatusDropdown';
import { EXPORT_PDF } from '../../constants/routes';

const propTypes = {
  agreement: PropTypes.shape({ zone: PropTypes.object }),
  plan: PropTypes.shape({}),
  user: PropTypes.shape({}).isRequired,
  references: PropTypes.shape({}).isRequired,
  pasturesMap: PropTypes.shape({}).isRequired,
  grazingSchedulesMap: PropTypes.shape({}).isRequired,
  ministerIssuesMap: PropTypes.shape({}).isRequired,
};
const defaultProps = {
  agreement: {
    zone: {},
    usage: [],
  },
  plan: {
    agreementId: '',
    pastures: [],
    grazingSchedules: [],
    ministerIssues: [],
  },
};

class RupStaff extends Component {
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
    } = this.props;
    const {
      isUpdateZoneModalOpen,
    } = this.state;

    const { agreementId, status } = plan;
    const { clients, usage: usages } = agreement;
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

        <RupStickyHeader>
          <div className="rup__actions__background">
            <div className="rup__actions__container">
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

          {isStatusIndicatingStaffFeedbackNeeded(status) &&
            <div className="rup__feedback-alert__background">
              <div className="rup__feedback-alert__container">
                <div className="rup__feedback-alert__title">
                  {`Provide input for ${planTypeDescription} Submission`}
                </div>
                Review the Range Use Plan and provide for feedback
              </div>
            </div>
          }
        </RupStickyHeader>

        <div className="rup__content">
          <RupBasicInformation
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            user={user}
            onZoneClicked={this.openUpdateZoneModal}
          />

          <RupPastures
            className="rup__pastures__container"
            plan={plan}
            pasturesMap={pasturesMap}
          />

          <RupGrazingSchedules
            className="rup__schedules__container"
            references={references}
            usages={usages}
            plan={plan}
            pasturesMap={pasturesMap}
            grazingSchedulesMap={grazingSchedulesMap}
          />

          <RupMinisterIssues
            className="rup__missues__container"
            references={references}
            plan={plan}
            pasturesMap={pasturesMap}
            ministerIssuesMap={ministerIssuesMap}
          />
        </div>
      </section>
    );
  }
}

RupStaff.propTypes = propTypes;
RupStaff.defaultProps = defaultProps;
export default RupStaff;
