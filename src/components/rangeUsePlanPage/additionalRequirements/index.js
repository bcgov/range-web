import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AdditionalRequirementRow from './AdditionalRequirementRow'
import { IfEditable } from '../../common/PermissionsField'
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields'
import { FieldArray } from 'formik'
import { Button, Confirm } from 'semantic-ui-react'
import uuid from 'uuid-v4'
import { deleteAdditionalRequirement } from '../../../api'

class AdditionalRequirements extends Component {
  static propTypes = {
    additionalRequirements: PropTypes.arrayOf(PropTypes.object).isRequired
  }

  constructor(props) {
    super(props)
    this.state = {
      indexToRemove: null
    }
  }

  renderAdditionalRequirement = (additionalRequirement, i) => {
    return (
      <AdditionalRequirementRow
        key={additionalRequirement.id}
        additionalRequirement={additionalRequirement}
        onDelete={() => this.setState({ indexToRemove: i })}
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
    const { indexToRemove } = this.state

    return (
      <FieldArray
        name="additionalRequirements"
        render={({ push, remove }) => (
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
                  className="icon labeled rup__add-button">
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
              {this.renderAdditionalRequirements(additionalRequirements)}
            </div>

            <Confirm
              header="Delete additional requirement"
              content="Are you sure?"
              open={indexToRemove !== null}
              onCancel={() => {
                this.setState({ indexToRemove: null })
              }}
              onConfirm={async () => {
                const requirement = additionalRequirements[indexToRemove]

                if (!uuid.isUUID(requirement.id)) {
                  await deleteAdditionalRequirement(
                    requirement.planId,
                    requirement.id
                  )
                }

                remove(indexToRemove)
                this.setState({ indexToRemove: null })
              }}
            />
          </div>
        )}
      />
    )
  }
}

export default AdditionalRequirements
