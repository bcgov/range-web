import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { NO_RUP_PROVIDED, DETAIL_RUP_BANNER_CONTENT } from '../../constants/strings';
import { EXPORT_PDF } from '../../constants/routes';
import { Status, Banner } from '../common';
import RupBasicInformation from './RupBasicInformation';
import RupPastures from './RupPastures';
import EditRupSchedules from './EditRupSchedules';

const propTypes = {
  agreement: PropTypes.shape({ plan: PropTypes.object }).isRequired,
  livestockTypes: PropTypes.arrayOf(PropTypes.object).isRequired,
  isDownloadingPDF: PropTypes.bool.isRequired,
};

export class EditRup extends Component {
  constructor(props) {
    super(props);

    // store fields that can be updated within this page
    this.state = {
      plan: props.agreement.plan,
    };
  }

  onViewPDFClicked = () => {
    const { id, agreementId } = this.state.plan;
    if (id && agreementId) {
      this.pdfLink.click();
    }
  }

  setPDFRef = (ref) => { this.pdfLink = ref; }

  render() {
    const {
      plan,
    } = this.state;

    const {
      agreement,
      isDownloadingPDF,
      livestockTypes,
    } = this.props;

    const status = plan && plan.status;
    const statusName = status && status.name;
    const agreementId = agreement && agreement.id;
    const zone = agreement && agreement.zone;
    const usage = agreement && agreement.usage;
    const rupExist = plan.id;

    return (
      <div className="rup">
        <a
          className="rup__pdf-link"
          target="_blank"
          href={`${EXPORT_PDF}/${agreementId}/${plan.id}`}
          ref={this.setPDFRef}
        >
          pdf link
        </a>

        <Banner
          header={agreementId}
          content={rupExist ? DETAIL_RUP_BANNER_CONTENT : NO_RUP_PROVIDED}
          actionClassName={rupExist ? 'rup__actions' : 'rup__actions--hidden'}
        >
          <Status
            className="rup__status"
            status={statusName}
          />
          <Button
            onClick={this.onViewPDFClicked}
            className="rup__btn"
            loading={isDownloadingPDF}
          >
            View PDF
          </Button>
        </Banner>

        <div className="rup__content">
          <RupBasicInformation
            className="rup__basic_information"
            agreement={agreement}
            plan={plan}
            zone={zone}
            isAdmin={false}
          />

          <RupPastures
            className="rup__pastures"
            plan={plan}
          />

          <EditRupSchedules
            className="rup__edit-schedules"
            livestockTypes={livestockTypes}
            plan={plan}
            usage={usage}
          />
        </div>
      </div>
    );
  }
}
EditRup.propTypes = propTypes;
export default EditRup;
