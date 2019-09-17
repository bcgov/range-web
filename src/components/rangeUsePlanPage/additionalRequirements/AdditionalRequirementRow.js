import React from 'react'
import PropTypes from 'prop-types'
import PermissionsField from '../../common/PermissionsField'
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Dropdown, TextArea } from 'formik-semantic-ui'

const AdditionalRequirementRow = ({ additionalRequirement, namespace }) => {
  const references = useReferences()

  const categories = references[REFERENCE_KEY.ADDITIONAL_REQUIREMENT_CATEGORY]
  const options = categories.map(category => ({
    key: category.id,
    value: category.id,
    text: category.name
  }))

  const { detail, url, categoryId } = additionalRequirement

  return (
    <div className="rup__a-requirement__row">
      <PermissionsField
        permission={ADDITIONAL_REQUIREMENTS.CATEGORY}
        name={`${namespace}.category`}
        component={Dropdown}
        options={options}
        displayValue={
          options.find(c => c.value === categoryId)
            ? options.find(c => c.value === categoryId).name
            : ''
        }
      />
      <div>
        <PermissionsField
          permission={ADDITIONAL_REQUIREMENTS.DESCRIPTION}
          name={`${namespace}.detail`}
          component={TextArea}
          displayValue={detail}
        />
        <div className="rup__a-requirement__url">
          <PermissionsField
            permission={ADDITIONAL_REQUIREMENTS.URL}
            name={`${namespace}.url`}
            displayValue={url}
            label="URL:"
            fieldProps={{
              inline: true
            }}
          />
        </div>
      </div>
    </div>
  )
}

AdditionalRequirementRow.propTypes = {
  additionalRequirement: PropTypes.shape({}).isRequired,
  namespace: PropTypes.string.isRequired
}

export default AdditionalRequirementRow
