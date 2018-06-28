import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { TextField } from '../../common';
import { formatDateFromServer, presentNullValue, getAgreementHolders, isUserAdmin } from '../../../utils';
import * as strings from '../../../constants/strings';

const propTypes = {
  user: PropTypes.shape({ isAdmin: PropTypes.bool }).isRequired,
  agreement: PropTypes.shape({}).isRequired,
  plan: PropTypes.shape({}).isRequired,
  zone: PropTypes.shape({}).isRequired,
  className: PropTypes.string.isRequired,
  onZoneClicked: PropTypes.func,
};

const defaultProps = {
  onZoneClicked: () => {},
};

class RupBasicInformation extends Component {
  renderOtherAgreementHolders = client => (
    <TextField
      key={client.id}
      label={strings.OTHER_AGREEMENT_HOLDER}
      text={client && client.name}
    />
  )

  render() {
    const {
      agreement,
      plan,
      zone,
      onZoneClicked,
      className,
      user,
    } = this.props;

    // variables for textfields
    const {
      code: zoneCode,
      district,
    } = zone || {};
    const districtCode = district && district.code;

    const staff = zone && zone.user;
    const { email: contactEmail, phone: contactPhoneNumber, fullName: contactName } = staff;

    const {
      rangeName,
      alternativeBusinessName,
      planStartDate,
      planEndDate,
      extension,
    } = plan || {};

    const {
      id,
      agreementStartDate,
      agreementEndDate,
      agreementExemptionStatus,
      clients,
    } = agreement || {};

    const exemptionStatusName = agreementExemptionStatus && agreementExemptionStatus.description;

    const { primaryAgreementHolder, otherAgreementHolders } = getAgreementHolders(clients);
    const { name: primaryAgreementHolderName } = primaryAgreementHolder;
    const isAdmin = isUserAdmin(user);
    const zoneText = isAdmin
      ? (
        <div className="rup__zone-text">
          {presentNullValue(zoneCode)}
          <Icon className="rup__zone-text__icon" name="pencil" />
        </div>
      )
      : presentNullValue(zoneCode);

    return (
      <div className={className}>
        <div className="rup__title">Basic Information</div>
        <div className="rup__row">
          <div className="rup__agreement-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Agreement Information</div>
            <TextField
              label={strings.RANGE_NUMBER}
              text={id}
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
              text={rangeName}
            />
            <TextField
              label={strings.ALTERNATIVE_BUSINESS_NAME}
              text={alternativeBusinessName}
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
              text={zoneText}
              isEditable={isAdmin}
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

RupBasicInformation.propTypes = propTypes;
RupBasicInformation.defaultProps = defaultProps;
export default RupBasicInformation;
