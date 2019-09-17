import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AdditionalRequirementRow from './AdditionalRequirementRow'
import { IfEditable } from '../../common/PermissionsField'
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields'
import { FieldArray } from 'formik'
import { Button } from 'semantic-ui-react'
import uuid from 'uuid-v4'

class AdditionalRequirements extends Component {
  static propTypes = {
    additionalRequirements: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  renderAdditionalRequirement = (additionalRequirement, i) => {
    return (
      <AdditionalRequirementRow
        key={additionalRequirement.id}
        additionalRequirement={additionalRequirement}
        namespace={`additionalRequirements.${i}`}
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
    const { additionalRequirements } = this.props

    return (
      <FieldArray
        name="additionalRequirements"
        render={({ push }) => (
          <div className="rup__a-requirements">
            <div className="rup__content-title--editable">
              Additional Requirements
              <IfEditable permission={ADDITIONAL_REQUIREMENTS.CATEGORY}>
                <Button
                  type="button"
                  basic
                  primary
                  onClick={() => {
                    push({
                      id: uuid(),
                      detail: '',
                      url: '',
                      categoryId: undefined
                    })
                  }}
                  className="icon labeled rup__pastures__add-button">
                  <i className="add circle icon" />
                  Add Requirement
                </Button>
              </IfEditable>
            </div>
            <div className="rup__divider" />
            <div className="rup__a-requirements__note">
              Other direction or agreements with which this Range Use Plan must
              be consistent. Contact a range staff member if you need more
              information.
            </div>
            <div className="rup__a-requirements__box">
              <div className="rup__a-requirement__header">
                <div>Category</div>
                <div>Details</div>
              </div>
              {this.renderAdditionalRequirements(additionalRequirements)}
            </div>
          </div>
        )}
      />
    )
  }
}

export default AdditionalRequirements
