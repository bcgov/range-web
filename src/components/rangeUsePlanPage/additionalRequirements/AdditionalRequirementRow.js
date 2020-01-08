import React from 'react'
import PropTypes from 'prop-types'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { ADDITIONAL_REQUIREMENTS } from '../../../constants/fields'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { Dropdown as PlainDropdown, Icon } from 'semantic-ui-react'
import { Dropdown, TextArea } from 'formik-semantic-ui'

const AdditionalRequirementRow = ({
  additionalRequirement,
  namespace,
  onDelete
}) => {
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
        inputProps={{ placeholder: 'Category' }}
        name={`${namespace}.categoryId`}
        component={Dropdown}
        options={options}
        displayValue={
          options.find(c => c.value === categoryId)
            ? options.find(c => c.value === categoryId).text
            : ''
        }
        label="Category"
        fast
        fieldProps={{ required: true }}
      />
      <div>
        <PermissionsField
          permission={ADDITIONAL_REQUIREMENTS.DESCRIPTION}
          name={`${namespace}.detail`}
          component={TextArea}
          displayValue={detail}
          inputProps={{
            placeholder:
              'Name, date, summary (ex. WHA Badger #8-329/#8-330, 2009, attractants and stubble heights)'
          }}
          label="Details"
          fast
          fieldProps={{ required: true }}
        />

        <PermissionsField
          permission={ADDITIONAL_REQUIREMENTS.URL}
          name={`${namespace}.url`}
          displayValue={url}
          label="URL"
          inputProps={{ placeholder: 'URL', fluid: true }}
          fast
        />
      </div>
      <IfEditable permission={ADDITIONAL_REQUIREMENTS.NAME}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 15
          }}>
          <PlainDropdown
            trigger={<Icon name="ellipsis vertical" />}
            options={[
              {
                key: 'delete',
                value: 'delete',
                text: 'Delete'
              }
            ]}
            icon={null}
            pointing="right"
            onClick={e => e.stopPropagation()}
            onChange={(e, { value }) => {
              if (value === 'delete') {
                onDelete()
              }
            }}
            selectOnBlur={false}
          />
        </div>
      </IfEditable>
    </div>
  )
}

AdditionalRequirementRow.propTypes = {
  additionalRequirement: PropTypes.shape({}).isRequired,
  namespace: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default React.memo(AdditionalRequirementRow)
