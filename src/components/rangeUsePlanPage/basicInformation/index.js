import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '../../common';
import { formatDateFromServer, getAgreementHolders, getUserFullName, capitalize, getClientFullName } from '../../../utils';
import * as strings from '../../../constants/strings';

class BasicInformation extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({ isAdmin: PropTypes.bool }).isRequired,
    agreement: PropTypes.shape({}).isRequired,
    onZoneClicked: PropTypes.func,
  }
  static defaultProps = {
    onZoneClicked: () => {},
  }

  renderOtherAgreementHolders = client => (
    <TextField
      key={client.id}
      label={strings.OTHER_AGREEMENT_HOLDER}
      text={getClientFullName(client)}
    />
  )

  render() {
    const {
      agreement,
      plan,
      onZoneClicked,
    } = this.props;

    // variables for textfields
    const zone = agreement && agreement.zone;
    const zoneCode = zone && zone.code;
    const district = zone && zone.district;
    const districtCode = district && district.code;

    const staff = zone && zone.user;
    const contactEmail = staff && staff.email;
    const contactPhoneNumber = staff && staff.phoneNumber;
    const contactName = getUserFullName(staff);

    const {
      rangeName,
      altBusinessName,
      planStartDate,
      planEndDate,
      extension,
    } = plan || {};

    const {
      id: agreementId,
      agreementStartDate,
      agreementEndDate,
      agreementExemptionStatus: aes,
      clients,
    } = agreement || {};

    const exemptionStatusName = aes && aes.description;
    const { primaryAgreementHolder, otherAgreementHolders } = getAgreementHolders(clients);
    const primaryAgreementHolderName = getClientFullName(primaryAgreementHolder);

    return (
      <div className="rup__basic_information">
        <div className="rup__content-title">Basic Information</div>
        <div className="rup__row">
          <div className="rup__agreement-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Agreement Information</div>
            <TextField
              label={strings.RANGE_NUMBER}
              text={agreementId}
            />
            <TextField
              label={strings.AGREEMENT_TYPE}
              text="Primary"
            />
            <TextField
              label={strings.AGREEMENT_DATE}
              text={`${formatDateFromServer(agreementStartDate)} to ${formatDateFromServer(agreementEndDate)}`}
            />
            <TextField
              label={strings.RANGE_NAME}
              text={capitalize(rangeName)}
            />
            <TextField
              label={strings.ALTERNATIVE_BUSINESS_NAME}
              text={altBusinessName}
            />
          </div>
          <div className="rup__contact-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Contact Information</div>
            <TextField
              label={strings.DISTRICT}
              text={districtCode}
            />
            <TextField
              label={strings.ZONE}
              text={zoneCode}
              // isEditable={isUserAdmin(user)} // doesn't need it since we pull data from FTA directly
              onClick={onZoneClicked}
            />
            <TextField
              label={strings.CONTACT_NAME}
              text={contactName}
            />
            <TextField
              label={strings.CONTACT_PHONE}
              text={contactPhoneNumber}
            />
            <TextField
              label={strings.CONTACT_EMAIL}
              text={contactEmail}
            />
          </div>
        </div>
        <div className="rup__row">
          <div className="rup__plan-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Plan Information</div>
            <TextField
              label={strings.PLAN_DATE}
              text={`${formatDateFromServer(planStartDate)} to ${formatDateFromServer(planEndDate)}`}
            />
            <TextField
              label={strings.EXTENDED}
              text={extension}
            />
            <TextField
              label={strings.EXEMPTION_STATUS}
              text={exemptionStatusName}
            />
          </div>

          <div className="rup__plan-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Agreement Holders</div>
            <TextField
              label={strings.PRIMARY_AGREEMENT_HOLDER}
              text={primaryAgreementHolderName}
            />
            {otherAgreementHolders.map(this.renderOtherAgreementHolders)}
          </div>
        </div>
      </div>
    );
  }
}

export default BasicInformation;
