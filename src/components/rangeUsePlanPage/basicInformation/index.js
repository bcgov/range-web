import React from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'
import { CircularProgress } from '@material-ui/core'
import * as API from '../../../constants/api'
import { TextField, InfoTip } from '../../common'
import * as strings from '../../../constants/strings'
import {
  formatDateFromServer,
  capitalize,
  getUserFullName,
  getAgreementHolders,
  getClientFullName,
  axios,
  getAuthHeaderConfig
} from '../../../utils'
import PermissionsField from '../../common/PermissionsField'
import { BASIC_INFORMATION } from '../../../constants/fields'
import DateInputField from '../../common/form/DateInputField'
import moment from 'moment'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { isUUID } from 'uuid-v4'

const getAgentForClient = (client, clientAgreements) => {
  const { agent } = clientAgreements.find(ca => ca.clientId === client.id)

  return agent
}

const BasicInformation = ({ plan, agreement }) => {
  const zone = agreement && agreement.zone
  const zoneCode = zone && zone.code
  const district = zone && zone.district
  const districtCode = district && district.code

  const staff = zone && zone.user
  const contactEmail = staff && staff.email
  const contactPhoneNumber = staff && staff.phoneNumber
  const contactName = getUserFullName(staff)

  const agreementTypes = useReferences()[REFERENCE_KEY.AGREEMENT_TYPE]

  const { rangeName, altBusinessName, planStartDate, planEndDate, extension } =
    plan || {}

  const {
    id: agreementId,
    agreementStartDate,
    agreementEndDate,
    agreementExemptionStatus: aes,
    clients
  } = agreement || {}

  const {
    data: clientAgreements,
    isValidating: isLoadingClientAgreements,
    error: errorFetchingClientAgreements
  } = useSWR(API.GET_CLIENT_AGREEMENTS(plan.id), key =>
    axios.get(key, getAuthHeaderConfig()).then(res => res.data)
  )

  const exemptionStatusName = aes && aes.description
  const { primaryAgreementHolder, otherAgreementHolders } = getAgreementHolders(
    clients
  )
  const primaryAgreementHolderName = getClientFullName(primaryAgreementHolder)

  const isFutureDatedPlan = plan.planEndDate > plan.agreement.agreementEndDate

  return (
    <div className="rup__basic_information">
      <div className="rup__popup-header">
        <div className="rup__content-title">{strings.BASIC_INFORMATION}</div>
        <InfoTip
          header={strings.BASIC_INFORMATION}
          content={strings.BASIC_INFORMATION_TIP}
        />
      </div>
      <div className="rup__row">
        <div className="rup__agreement-info rup__cell-6">
          <div className="rup__divider" />
          <div className="rup__info-title">Agreement Information</div>
          <TextField label={strings.RANGE_NUMBER} text={agreementId} />
          <TextField
            label={strings.AGREEMENT_TYPE}
            text={
              agreementTypes.find(a => a.id === agreement.agreementTypeId)
                ?.description
            }
          />
          <TextField
            label={strings.AGREEMENT_DATE}
            text={`${formatDateFromServer(
              agreementStartDate
            )} to ${formatDateFromServer(agreementEndDate)}`}
          />
          <PermissionsField
            permission={BASIC_INFORMATION.RANGE_NAME}
            tip={strings.RANGE_NAME_TIP}
            name="rangeName"
            displayValue={capitalize(rangeName)}
            label={strings.RANGE_NAME}
            fieldProps={{ required: true }}
            fast
          />
          <PermissionsField
            permission={BASIC_INFORMATION.ALTERNATE_BUSINESS_NAME}
            name="altBusinessName"
            displayValue={altBusinessName}
            label={strings.ALTERNATIVE_BUSINESS_NAME}
            fast
          />
        </div>
        <div className="rup__contact-info rup__cell-6">
          <div className="rup__divider" />
          <div className="rup__info-title">Contact Information</div>
          <TextField label={strings.DISTRICT} text={districtCode} />
          <TextField label={strings.ZONE} text={zoneCode} />
          <TextField label={strings.CONTACT_NAME} text={contactName} />
          <TextField label={strings.CONTACT_PHONE} text={contactPhoneNumber} />
          <TextField label={strings.CONTACT_EMAIL} text={contactEmail} />
        </div>
      </div>
      <div className="rup__row">
        <div className="rup__plan-info rup__cell-6">
          <div className="rup__divider" />
          <div className="rup__info-title">Plan Information</div>
          <PermissionsField
            name="planStartDate"
            permission={BASIC_INFORMATION.PLAN_START_DATE}
            component={DateInputField}
            displayValue={moment(planStartDate).format('MMMM DD, YYYY')}
            label={strings.PLAN_START_DATE}
            dateFormat="MMMM DD, YYYY"
            required
          />
          <PermissionsField
            name="planEndDate"
            permission={BASIC_INFORMATION.PLAN_END_DATE}
            component={DateInputField}
            displayValue={moment(planEndDate).format('MMMM DD, YYYY')}
            label={strings.PLAN_END_DATE}
            dateFormat="MMMM DD, YYYY"
            required
          />

          {isFutureDatedPlan && (
            <div>
              If your plan end date extends past the agreement date, the usage
              from the last year will be copied forward each year to plan end on
              saving.
              <br />
              <br />
            </div>
          )}

          <TextField label={strings.EXTENDED} text={extension} />
          <TextField
            label={strings.EXEMPTION_STATUS}
            text={exemptionStatusName}
          />
        </div>

        {isLoadingClientAgreements && !clientAgreements && <CircularProgress />}
        {!isUUID(plan.id) && errorFetchingClientAgreements && (
          <span>Error: {errorFetchingClientAgreements.message}</span>
        )}
        {!clientAgreements && isUUID(plan.id) && (
          <div className="rup__plan-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Agreement Holders</div>
            <TextField
              label={strings.PRIMARY_AGREEMENT_HOLDER}
              text={primaryAgreementHolderName}
            />
            {otherAgreementHolders.map(client => (
              <TextField
                key={client.id}
                label={strings.OTHER_AGREEMENT_HOLDER}
                text={getClientFullName(client)}
              />
            ))}
          </div>
        )}
        {clientAgreements && (
          <div className="rup__plan-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Agreement Holders</div>
            <TextField
              label={strings.PRIMARY_AGREEMENT_HOLDER}
              text={`${primaryAgreementHolderName} ${
                getAgentForClient(primaryAgreementHolder, clientAgreements)
                  ? `- Agent: ${getUserFullName(
                      getAgentForClient(
                        primaryAgreementHolder,
                        clientAgreements
                      )
                    )}`
                  : ''
              }`}
            />
            {otherAgreementHolders.map(client => (
              <TextField
                key={client.id}
                label={strings.OTHER_AGREEMENT_HOLDER}
                text={`${getClientFullName(client)} ${
                  getAgentForClient(client, clientAgreements)
                    ? `- Agent: ${getUserFullName(
                        getAgentForClient(client, clientAgreements)
                      )}`
                    : ''
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

BasicInformation.propTypes = {
  plan: PropTypes.shape({}).isRequired,
  agreement: PropTypes.shape({}).isRequired
}

export default BasicInformation
