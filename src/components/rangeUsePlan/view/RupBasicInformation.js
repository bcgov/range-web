import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { TextField } from '../../common';
import { formatDateFromServer, presentNullValue, isUserAdmin } from '../../../handlers';
import {
  RANGE_NUMBER, AGREEMENT_DATE, AGREEMENT_TYPE, DISTRICT,
  ZONE, PLAN_DATE, CONTACT_NAME, CONTACT_EMAIL, CONTACT_PHONE,
  EXTENDED, EXEMPTION_STATUS, ALTERNATIVE_BUSINESS_NAME,
  RANGE_NAME, PRIMARY_AGREEMENT_HOLDER, OTHER_AGREEMENT_HOLDER,
} from '../../../constants/strings';
import { PRIMARY_TYPE, OTHER_TYPE } from '../../../constants/variables';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
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
  getAgreementHolders = (clients = []) => {
    let primaryAgreementHolder = {};
    const otherAgreementHolders = [];
    clients.forEach((client) => {
      if (client.clientTypeCode === PRIMARY_TYPE) {
        primaryAgreementHolder = client;
      } else if (client.clientTypeCode === OTHER_TYPE) {
        otherAgreementHolders.push(client);
      }
    });

    return { primaryAgreementHolder, otherAgreementHolders };
  }

  renderOtherAgreementHolders = client => (
    <TextField
      key={client.id}
      label={OTHER_AGREEMENT_HOLDER}
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
    } = this.props;

    // variables for textfields
    const {
      code: zoneCode,
      user,
      district,
    } = zone || {};
    const districtCode = district && district.code;

    const {
      email: contactEmail,
      givenName,
      familyName,
      contactPhoneNumber,
    } = user || {};
    const contactName = givenName && familyName && `${givenName} ${familyName}`;

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

    const { primaryAgreementHolder, otherAgreementHolders } = this.getAgreementHolders(clients);
    const { name: primaryAgreementHolderName } = primaryAgreementHolder;
    const isAdmin = isUserAdmin(this.props.user);
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
              label={RANGE_NUMBER}
              text={id}
            />
            <TextField
              label={AGREEMENT_TYPE}
              text="Primary"
            />
            <TextField
              label={AGREEMENT_DATE}
              text={`${formatDateFromServer(agreementStartDate)} to ${formatDateFromServer(agreementEndDate)}`}
            />
            <TextField
              label={RANGE_NAME}
              text={rangeName}
            />
            <TextField
              label={ALTERNATIVE_BUSINESS_NAME}
              text={alternativeBusinessName}
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
              text={zoneText}
              isEditable={isAdmin}
              onClick={onZoneClicked}
            />
            <TextField
              label={CONTACT_NAME}
              text={contactName}
            />
            <TextField
              label={CONTACT_PHONE}
              text={contactPhoneNumber}
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
              text={`${formatDateFromServer(planStartDate)} to ${formatDateFromServer(planEndDate)}`}
            />
            <TextField
              label={EXTENDED}
              text={extension}
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
