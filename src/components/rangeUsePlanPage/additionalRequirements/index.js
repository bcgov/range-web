import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AdditionalRequirementRow from './AdditionalRequirementRow'

class AdditionalRequirements extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    additionalRequirementsMap: PropTypes.shape({}).isRequired
  }

  renderAdditionalRequirement = additionalRequirement => {
    return (
      <AdditionalRequirementRow
        key={additionalRequirement.id}
        additionalRequirement={additionalRequirement}
      />
    )
  }

  renderAdditionalRequirements = (additionalRequirements = []) => {
    const isEmpty = additionalRequirements.length === 0

    return isEmpty ? (
      <div className="rup__a-requirements__no-content">
        No additional requirements provided
      </div>
    ) : (
      additionalRequirements.map(this.renderAdditionalRequirement)
    )
  }

  render() {
    const { plan, additionalRequirementsMap } = this.props
    const additionalRequirementIds = plan && plan.additionalRequirements
    const additionalRequirements =
      additionalRequirementIds &&
      additionalRequirementIds.map(id => additionalRequirementsMap[id])

    return (
      <div className="rup__a-requirements">
        <div className="rup__content-title">Additional Requirements</div>
        <div className="rup__divider" />
        <div className="rup__a-requirements__note">
          Other direction or agreements with which this Range Use Plan must be
          consistent. Contact a range staff member if you need more information.
        </div>
        <div className="rup__a-requirements__box">
          <div className="rup__a-requirement__header">
            <div>Category</div>
            <div>Details</div>
          </div>
          {this.renderAdditionalRequirements(additionalRequirements)}
        </div>
      </div>
    )
  }
}

export default AdditionalRequirements
