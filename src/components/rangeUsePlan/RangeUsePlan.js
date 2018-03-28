import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Icon, Button, Dropdown } from 'semantic-ui-react';
import mockupPDF from './mockup.pdf';

import UpdateZoneModal from './UpdateZoneModal';
import { RANGE_NUMBER, AGREEMENT_DATE,
  AGREEMENT_TYPE, DISTRICT, ZONE, PLAN_DATE,
  CONTACT_NAME, CONTACT_EMAIL, CONTACT_PHONE, EXTENDED, EXEMPTION_STATUS,
  ALTERNATIVE_BUSINESS_NAME, RANGE_NAME,
  COMPLETED_CONFIRMATION_CONTENT, COMPLETED_CONFIRMATION_HEADER,
  PENDING_CONFIRMATION_CONTENT, PENDING_CONFIRMATION_HEADER,
  DETAIL_RUP_BANNER_CONTENT, PRIMARY_AGREEMENT_HOLDER, OTHER_AGREEMENT_HOLDER,
} from '../../constants/strings';
import { COMPLETED, PENDING } from '../../constants/variables';
import { TextField, Status, ConfirmationModal, Banner } from '../common';
import { formatDate } from '../../handlers';

const propTypes = {
  agreement: PropTypes.object.isRequired,
  updateRupStatus: PropTypes.func.isRequired,
  statuses: PropTypes.array.isRequired,
  isUpdatingStatus: PropTypes.bool.isRequired,
};

const defaultProps = {

};

export class RangeUsePlan extends Component {
  state = {
    isCompletedModalOpen: false,
    isPendingModalOpen: false,
    isUpdateZoneModalOpen: false,
    zone: {},
    status: {},
  }

  componentDidMount() {
    // store fields that can be updated within this page
    const { zone, plans } = this.props.agreement;
    const plan = plans[0];
    const status = plan && plan.status;
    this.setState({
      zone,
      status,
      plan,
    });
  }

  onViewClicked = () => {
    this.pdfLink.click();
  }

  openCompletedConfirmModal = () => this.setState({ isCompletedModalOpen: true })

  closeCompletedConfirmModal = () => this.setState({ isCompletedModalOpen: false })

  openPendingConfirmModal = () => this.setState({ isPendingModalOpen: true })
  
  closePendingConfirmModal = () => this.setState({ isPendingModalOpen: false })

  openUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: true })

  closeUpdateZoneModal = () => this.setState({ isUpdateZoneModalOpen: false })

  updateStatus = (statusName, closeConfirmModal) => {
    const { agreement, statuses, updateRupStatus } = this.props;
    const plan = agreement.plans[0];
    const status = statuses.find(status => status.name === statusName);
    if (status) {
      const requestData = {
        planId: plan.id,
        statusId: status.id,
      };
      
      const statusUpdated = (newStatus) => {
        closeConfirmModal();
        this.setState({
          status: newStatus,
        });
      };
      updateRupStatus(requestData).then(statusUpdated);
    }
  }

  onYesCompletedClicked = () => {
    this.updateStatus(COMPLETED, this.closeCompletedConfirmModal);
  }

  onYesPendingClicked = () => {
    this.updateStatus(PENDING, this.closePendingConfirmModal);
  }

  onZoneClicked = () => {
    this.openUpdateZoneModal();
  }

  onZoneUpdated = (newZone) => {
    this.setState({ zone: newZone });
  }

  render() {
    const { 
      isCompletedModalOpen,
      isPendingModalOpen,
      isUpdateZoneModalOpen,
      zone,
      status,
      plan,
    } = this.state;
    const { agreement, isUpdatingStatus } = this.props;
    const statusDropdownOptions = [
      { key: 1, text: COMPLETED, value: 1, onClick: this.openCompletedConfirmModal },
      { key: 2, text: PENDING, value: 2, onClick: this.openPendingConfirmModal },
    ];

    // variables for textfields
    const zoneCode = zone && zone.code;
    const contactEmail = zone && zone.contactEmail;
    const contactName = zone && zone.contactName;
    const contactPhone = zone && zone.contactPhoneNumber;
    const districtCode = zone && zone.district && zone.district.code;
    const statusName = status && status.name;
    const rangeName = plan && plan.rangeName;
    const alternateBusinessName = plan && plan.alternateBusinessName;
    const planStartDate = plan && plan.planStartDate;
    const planEndDate = plan && plan.planEndDate;
    const extention = plan && plan.extension;

    const {
      id,
      agreementStartDate,
      agreementEndDate,
      primaryAgreementHolder,
      agreementExemptionStatus,
    } = agreement;
    const primaryAgreementHolderName = primaryAgreementHolder && primaryAgreementHolder.name;
    const exemptionStatusName = agreementExemptionStatus && agreementExemptionStatus.description;

    return (
      <div className="rup">
        <a 
          className="rup__pdf-link" 
          href={mockupPDF}
          ref={(pdfLink) => this.pdfLink = pdfLink}
          target="_black" 
        >
          pdf link
        </a>
        
        <UpdateZoneModal 
          isUpdateZoneModalOpen={isUpdateZoneModalOpen}
          closeUpdateZoneModal={this.closeUpdateZoneModal}
          onZoneUpdated={this.onZoneUpdated}
          agreementId={id}
          currZone={zone}
        />

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
          header={id}
          content={DETAIL_RUP_BANNER_CONTENT}
          actionClassName="rup__actions"
        >
          <Status 
            className="rup__status" 
            status={statusName}
          />
          <div>
            <Button 
              onClick={this.onViewClicked}
              className="rup__btn" 
            >
              View PDF
            </Button>
            { statusName !== COMPLETED && 
              <Dropdown
                className="rup__status-dropdown"
                text='Update Status' 
                options={statusDropdownOptions} 
                button
                item 
              />
            }
          </div>
        </Banner>
        
        <div className="rup__content container">
          <div className="rup__title">Basic Information</div>
          <div className="rup__row">
            <div className="rup__agreement-info rup__cell-6">
              <div className="rup__divider" />
              <div className="rup__info-title">Agreement Information</div>
              <TextField 
                label={RANGE_NUMBER}
                text={id}
              />
              <TextField 
                label={AGREEMENT_TYPE}
                text={'Primary'}
              />
              <TextField 
                label={AGREEMENT_DATE}
                text={`${formatDate(agreementStartDate)} to ${formatDate(agreementEndDate)}` }
              />
              <TextField 
                label={RANGE_NAME}
                text={rangeName}
              />
              <TextField 
                label={ALTERNATIVE_BUSINESS_NAME}
                text={alternateBusinessName}
              />
            </div>
            <div className="rup__contact-info rup__cell-6">
              <div className="rup__divider" />
              <div className="rup__info-title">Contact Information</div>
              <TextField 
                label={DISTRICT}
                text={districtCode}
              />
              <TextField 
                label={ZONE}
                text={
                  <div className="rup__zone-text">
                    {zoneCode}
                    <Icon className="rup__zone-text__icon" name='pencil' />
                  </div>
                }
                onClick={this.onZoneClicked} 
              />
              <TextField 
                label={CONTACT_NAME}
                text={contactName}
              />
              <TextField 
                label={CONTACT_PHONE}
                text={contactPhone}
              />
              <TextField 
                label={CONTACT_EMAIL}
                text={contactEmail}
              />
            </div>  
          </div>
          <div className="rup__row">
            <div className="rup__plan-info rup__cell-6">
              <div className="rup__divider" />
              <div className="rup__info-title">Plan Information</div>
              <TextField 
                label={PLAN_DATE}
                text={`${formatDate(planStartDate)} to ${formatDate(planEndDate)}`}
              />
              <TextField 
                label={EXTENDED}
                text={extention}
              />
              <TextField 
                label={EXEMPTION_STATUS}
                text={exemptionStatusName}
              />
            </div>
            
            <div className="rup__plan-info rup__cell-6">
              <div className="rup__divider" />
              <div className="rup__info-title">Agreement Holders</div>
              <TextField 
                label={PRIMARY_AGREEMENT_HOLDER}
                text={primaryAgreementHolderName}
              />
              <TextField 
                label={OTHER_AGREEMENT_HOLDER}
                text={''}
              />
              <TextField 
                label={OTHER_AGREEMENT_HOLDER}
                text={''}
              />
            </div>
          </div>
          {/* <div className="rup__divider" />
          <div className="rup__plan-info">
            <div className="rup__info-title">Plan Information</div>
            <div className="rup__row">
              <div className="rup__cell-6">
                <TextField 
                  label={PLAN_START}
                  text={formatDate(planStartDate)}
                />
                <TextField 
                  label={PLAN_END}
                  text={formatDate(planEndDate)}
                />
              </div>
              <div className="rup__cell-6">
                <TextField 
                  label={EXTENDED}
                  text={extended}
                />
                <TextField 
                  label={EXEMPTION_STATUS}
                  text={exemptionStatus}
                />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

RangeUsePlan.propTypes = propTypes;
RangeUsePlan.defaultProps = defaultProps;

export default RangeUsePlan;