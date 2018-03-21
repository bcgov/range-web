import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Dropdown } from 'semantic-ui-react';
import mockupPDF from './mockup.pdf';

import { RANGE_NUMBER, PLAN_START, PLAN_END, AGREEMENT_END, 
  AGREEMENT_START, AGREEMENT_TYPE, DISTRICT, ZONE, 
  ALTERNATIVE_BUSINESS_NAME, AGREEMENT_HOLDERS, TYPE, RANGE_NAME,
  COMPLETED_CONFIRMATION_CONTENT, COMPLETED_CONFIRMATION_HEADER,
  PENDING_CONFIRMATION_CONTENT, PENDING_CONFIRMATION_HEADER,
  DETAIL_RUP_BANNER_CONTENT,
} from '../../constants/strings';
import { COMPLETED, PENDING } from '../../constants/variables';
import { TextField, Status, ConfirmationModal, Banner } from '../common';
import { formatDate } from '../../handlers';

const propTypes = {
  rangeUsePlan: PropTypes.object.isRequired,
  updateRupStatus: PropTypes.func.isRequired,
  statuses: PropTypes.array.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
  newStatus: PropTypes.object.isRequired,
};

const defaultProps = {

};

export class RangeUsePlan extends Component {
  state = {
    isCompletedModalOpen: false,
    isPendingModalOpen: false,
  }

  onViewClicked = () => {
    this.pdfLink.click();
  }

  openCompletedConfirmModal = () => {
    this.setState({ isCompletedModalOpen: true });
  }

  closeCompletedConfirmModal = () => {
    this.setState({ isCompletedModalOpen: false });
  }

  openPendingConfirmModal = () => {
    this.setState({ isPendingModalOpen: true });
  }
  
  closePendingConfirmModal = () => {
    this.setState({ isPendingModalOpen: false });
  }

  updateStatus = (statusName, closeConfirmModal) => {
    const { rangeUsePlan, statuses, updateRupStatus } = this.props;
    const status = statuses.find(status => status.name === statusName);
    if(status) {
      const requestData = {
        agreementId: rangeUsePlan.id,
        statusId: status.id,
      }
  
      updateRupStatus(requestData).then(closeConfirmModal);
    }
  }

  onYesCompletedClicked = () => {
    this.updateStatus(COMPLETED, this.closeCompletedConfirmModal);
  }

  onYesPendingClicked = () => {
    this.updateStatus(PENDING, this.closePendingConfirmModal);
  }

  render() {
    const { isCompletedModalOpen, isPendingModalOpen } = this.state;
    const { rangeUsePlan, isUpdatingStatus, newStatus } = this.props;
    const statusDropdownOptions = [
      { key: 1, text: COMPLETED, value: 1, onClick: this.openCompletedConfirmModal },
      { key: 2, text: PENDING, value: 2, onClick: this.openPendingConfirmModal },
    ];

    const { 
      agreementId,
      agreementStartDate,
      agreementEndDate,
      zone,
      rangeName,
      alternateBusinessName,
      planStartDate,
      planEndDate,
      status,
      primaryAgreementHolder,
    } = rangeUsePlan;
    const districtCode = zone && zone.district && zone.district.code;
    const zoneCode = zone && zone.code;
    const statusName = (newStatus && newStatus.name) || 
      (status && status.name);
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;

    return (
      <div className="range-use-plan">
        <a 
          className="range-use-plan__pdf-link" 
          href={mockupPDF}
          ref={(pdfLink) => this.pdfLink = pdfLink}
          target="_black" 
        >
          pdf link
        </a>

        <ConfirmationModal
          open={isCompletedModalOpen}
          header={COMPLETED_CONFIRMATION_HEADER}
          content={COMPLETED_CONFIRMATION_CONTENT}
          onNoClicked={this.closeCompletedConfirmModal}
          onYesClicked={this.onYesCompletedClicked}
          loading={isUpdatingStatus}
        />

        <ConfirmationModal 
          open={isPendingModalOpen}
          header={PENDING_CONFIRMATION_HEADER}
          content={PENDING_CONFIRMATION_CONTENT}
          onNoClicked={this.closePendingConfirmModal}
          onYesClicked={this.onYesPendingClicked}
          loading={isUpdatingStatus}
        />

        <Banner
          header={agreementId}
          content={DETAIL_RUP_BANNER_CONTENT}
          actionClassName="range-use-plan__actions"
        >
          <Status 
            className="range-use-plan__status" 
            status={statusName}
          />
          <div>
            <Button 
              onClick={this.onViewClicked}
              className="range-use-plan__btn" 
            >
              View PDF
            </Button>
            <Dropdown 
              text='Update Status' 
              options={statusDropdownOptions} 
              button
              item 
            />
          </div>
        </Banner>
        
        <div className="range-use-plan__content container">
          <Header as='h2'>Basic Information</Header>
          <div className="range-use-plan__basic-info-first-row">
            <TextField 
              label={RANGE_NUMBER}
              text={agreementId}
            />
            <TextField 
              label={AGREEMENT_START}
              text={formatDate(agreementStartDate)}
            />
            <TextField 
              label={AGREEMENT_END}
              text={formatDate(agreementEndDate)}
            />
          </div>
          <div className="range-use-plan__basic-info-second-row">
            <TextField 
              label={AGREEMENT_HOLDERS}
              text={primaryAgreementHolderName}
            />

            <TextField 
              label={TYPE}
              text={'Primary'}
            />

            <TextField 
              label={AGREEMENT_HOLDERS}
              text={'Luke Skywalker'}
              isLabelHidden={true}
            />

            <TextField 
              label={TYPE}
              text={'Others'}
              isLabelHidden={true}
            />
          </div>
          <div className="range-use-plan__basic-info-third-row">
            <TextField 
              label={AGREEMENT_TYPE}
              text={'E01'}
            />
            <TextField 
              label={DISTRICT}
              text={districtCode}
            />
            <TextField 
              label={ZONE}
              text={zoneCode}
            />
          </div>
            
          <div className="range-use-plan__agreement-info">
            <TextField 
              label={RANGE_NAME}
              text={rangeName}
            />
            <TextField 
              label={ALTERNATIVE_BUSINESS_NAME}
              text={alternateBusinessName}
            />
            <TextField 
              label={PLAN_START}
              text={formatDate(planStartDate)}
            />
            <TextField 
              label={PLAN_END}
              text={formatDate(planEndDate)}
            />
          </div>
        </div>
      </div>
    );
  }
}

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;

export default RangeUsePlan;