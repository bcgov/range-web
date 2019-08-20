import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Input } from 'semantic-ui-react'
import Pikaday from 'pikaday'
import classnames from 'classnames'
import { TextField } from '../../common'
import {
  formatDateFromServer,
  getAgreementHolders,
  getUserFullName,
  capitalize,
  getClientFullName
} from '../../../utils'
import * as strings from '../../../constants/strings'
import { DATE_FORMAT } from '../../../constants/variables'
import { planUpdated } from '../../../actions'

class EditableBasicInformation extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({ isAdmin: PropTypes.bool }).isRequired,
    agreement: PropTypes.shape({}).isRequired,
    onZoneClicked: PropTypes.func,
    planUpdated: PropTypes.func.isRequired
  }
  static defaultProps = {
    onZoneClicked: () => {}
  }

  componentDidMount() {
    const { planStartDate, planEndDate } = this.props.plan || {}
    const { agreementStartDate, agreementEndDate } = this.props.agreement || {}

    const planStart = planStartDate ? new Date(planStartDate) : null
    const planEnd = planEndDate ? new Date(planEndDate) : null
    const minDate = agreementStartDate ? new Date(agreementStartDate) : null
    const maxDate = agreementEndDate ? new Date(agreementEndDate) : null

    this.pikaDayPlanStart = new Pikaday({
      field: this.planStartRef,
      format: DATE_FORMAT.CLIENT_SIDE,
      minDate,
      maxDate: planEnd || maxDate,
      defaultDate: planStart || minDate,
      setDefaultDate: planStart !== null,
      onSelect: this.handleDateChange('planStart')
    })

    this.pikaDayPlanEnd = new Pikaday({
      field: this.planEndRef,
      format: DATE_FORMAT.CLIENT_SIDE,
      minDate: planStart || minDate,
      maxDate,
      defaultDate: planEnd || maxDate,
      setDefaultDate: planEnd !== null,
      onSelect: this.handleDateChange('planEnd')
    })
  }

  setPlanStart = ref => {
    this.planStartRef = ref
  }
  setPlanEnd = ref => {
    this.planEndRef = ref
  }

  handleDateChange = key => date => {
    // prevent users from inputting wrong dates
    if (this.pikaDayPlanStart && key === 'planEnd') {
      this.pikaDayPlanStart.setMaxDate(date)
    } else if (this.pikaDayPlanEnd && key === 'planStart') {
      this.pikaDayPlanEnd.setMinDate(date)
    }

    this.onTextFieldChange(`${key}Date`, date)
  }

  renderOtherAgreementHolders = client => (
    <TextField
      key={client.id}
      label={strings.OTHER_AGREEMENT_HOLDER}
      text={getClientFullName(client)}
    />
  )

  onTextFieldChange = (field, value) => {
    this.props.planUpdated({
      plan: { ...this.props.plan, [field]: value }
    })
  }

  render() {
    const { agreement, plan, onZoneClicked } = this.props

    // variables for textfields
    const zone = agreement && agreement.zone
    const zoneCode = zone && zone.code
    const district = zone && zone.district
    const districtCode = district && district.code

    const staff = zone && zone.user
    const contactEmail = staff && staff.email
    const contactPhoneNumber = staff && staff.phoneNumber
    const contactName = getUserFullName(staff)

    const { rangeName, altBusinessName, extension } = plan || {}

    const {
      id: agreementId,
      agreementStartDate,
      agreementEndDate,
      agreementExemptionStatus: aes,
      clients
    } = agreement || {}

    const exemptionStatusName = aes && aes.description
    const {
      primaryAgreementHolder,
      otherAgreementHolders
    } = getAgreementHolders(clients)
    const primaryAgreementHolderName = getClientFullName(primaryAgreementHolder)

    return (
      <div className="rup__basic_information">
        <div className="rup__content-title">Basic Information</div>
        <div className="rup__row">
          <div className="rup__agreement-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Agreement Information</div>
            <TextField label={strings.RANGE_NUMBER} text={agreementId} />
            <TextField label={strings.AGREEMENT_TYPE} text="Primary" />
            <TextField
              label={strings.AGREEMENT_DATE}
              text={`${formatDateFromServer(
                agreementStartDate
              )} to ${formatDateFromServer(agreementEndDate)}`}
            />
            <div className={classnames('text-field__label')}>
              {strings.RANGE_NAME}
            </div>
            <Input className={classnames('text-field__text')}>
              <input
                type="text"
                value={capitalize(rangeName)}
                onChange={e =>
                  this.onTextFieldChange('rangeName', e.target.value)
                }
              />
            </Input>
            <div className={classnames('text-field__label')}>
              {strings.ALTERNATIVE_BUSINESS_NAME}
            </div>
            <Input className={classnames('text-field__text')}>
              <input
                type="text"
                value={altBusinessName || ''}
                onChange={e =>
                  this.onTextFieldChange('altBusinessName', e.target.value)
                }
              />
            </Input>
          </div>
          <div className="rup__contact-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Contact Information</div>
            <TextField label={strings.DISTRICT} text={districtCode} />
            <TextField
              label={strings.ZONE}
              text={zoneCode}
              onClick={onZoneClicked}
            />
            <TextField label={strings.CONTACT_NAME} text={contactName} />
            <TextField
              label={strings.CONTACT_PHONE}
              text={contactPhoneNumber}
            />
            <TextField label={strings.CONTACT_EMAIL} text={contactEmail} />
          </div>
        </div>
        <div className="rup__row">
          <div className="rup__plan-info rup__cell-6">
            <div className="rup__divider" />
            <div className="rup__info-title">Plan Information</div>
            <div className={classnames('text-field__label')}>
              {strings.PLAN_START_DATE}
            </div>
            <Input className={classnames('text-field__text')}>
              <input type="text" ref={this.setPlanStart} />
            </Input>
            <div className={classnames('text-field__label')}>
              {strings.PLAN_END_DATE}
            </div>
            <Input className={classnames('text-field__text')}>
              <input type="text" ref={this.setPlanEnd} />
            </Input>
            <TextField label={strings.EXTENDED} text={extension} />
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
    )
  }
}

export default connect(
  null,
  {
    planUpdated
  }
)(EditableBasicInformation)
