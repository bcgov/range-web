import React from 'react'
import PropTypes from 'prop-types'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { MANAGEMENT_CONSIDERATIONS } from '../../../constants/fields'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { TextArea } from 'formik-semantic-ui'
import { Dropdown, Icon, Form } from 'semantic-ui-react'
import { Dropdown as FormikDropdown } from 'formik-semantic-ui'

const ManagementConsiderationRow = ({
  namespace,
  managementConsideration,
  onDelete
}) => {
  const { detail, url, considerationTypeId } = managementConsideration
  const references = useReferences()
  const considerTypes =
    references[REFERENCE_KEY.MANAGEMENT_CONSIDERATION_TYPE] || []
  const considerTypeOptions = considerTypes.map(ct => ({
    key: ct.id,
    value: ct.id,
    text: ct.name
  }))
  const ellipsisOptions = [
    {
      key: 'delete',
      text: 'Delete',
      onClick: onDelete
    }
  ]

  return (
    <div className="rup__m-consideration__row">
      <div>
        <PermissionsField
          permission={MANAGEMENT_CONSIDERATIONS.TYPE}
          name={`${namespace}.considerationTypeId`}
          component={FormikDropdown}
          options={considerTypeOptions}
          displayValue={
            considerTypes.find(type => type.id === considerationTypeId)
              ? considerTypes.find(type => type.id === considerationTypeId).name
              : ''
          }
          inputProps={{
            fluid: true
          }}
        />
      </div>
      <div>
        <Form.Group widths="equal">
          <div style={{ width: '100%', marginLeft: '5px' }}>
            <PermissionsField
              permission={MANAGEMENT_CONSIDERATIONS.DESCRIPTION}
              name={`${namespace}.detail`}
              component={TextArea}
              displayValue={detail}
            />
            <PermissionsField
              permission={MANAGEMENT_CONSIDERATIONS.DESCRIPTION}
              name={`${namespace}.url`}
              displayValue={url}
              label="URL"
              fieldProps={{
                style: {
                  marginTop: '5px'
                }
              }}
            />
          </div>

          <IfEditable permission={MANAGEMENT_CONSIDERATIONS.NAME}>
            <div className="rup__m-consideration__ellipsis">
              <Dropdown
                trigger={
                  <Icon name="ellipsis vertical" style={{ margin: '0' }} />
                }
                options={ellipsisOptions}
                icon={null}
                pointing="right"
                style={{ marginLeft: '5px', marginTop: '10px' }}
              />
            </div>
          </IfEditable>
        </Form.Group>
      </div>
    </div>
  )
}

ManagementConsiderationRow.propTypes = {
  namespace: PropTypes.string.isRequired,
  managementConsideration: PropTypes.object.isRequired
}

export default ManagementConsiderationRow
