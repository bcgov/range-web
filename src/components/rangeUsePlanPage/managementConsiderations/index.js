import React from 'react'
import PropTypes from 'prop-types'
import { Dropdown, Icon } from 'semantic-ui-react'
import { PrimaryButton } from '../../common'
import { useReferences } from '../../../providers/ReferencesProvider'
import { REFERENCE_KEY } from '../../../constants/variables'
import { FieldArray } from 'formik'
import ManagementConsiderationRow from './ManagementConsiderationRow'

const ManagementConsiderations = ({ managementConsiderations }) => {
  const references = useReferences()
  const considerTypes =
    references[REFERENCE_KEY.MANAGEMENT_CONSIDERATION_TYPE] || []
  const considerTypeOptions = considerTypes.map(ct => ({
    key: ct.id,
    value: ct.id,
    text: ct.name
  }))

  return (
    <FieldArray
      name={`managementConsiderations`}
      render={({ push }) => (
        <div className="rup__m-considerations">
          <div className="rup__content-title">Management Considerations</div>
          <div className="rup__divider" />

          <div className="rup__m-considerations__note">
            Content in this section is non-legal and is intended to provide
            additional information about management within the agreement area.
          </div>

          <div className="rup__m-considerations__box">
            <div className="rup__m-consideration__header">
              <div>Considerations</div>
              <div>Details</div>
            </div>

            {managementConsiderations.length === 0 ? (
              <div className="rup__m-considerations__no-content">
                No management considerations provided
              </div>
            ) : (
              managementConsiderations.map((managementConsideration, index) => (
                <ManagementConsiderationRow
                  key={managementConsideration.id}
                  managementConsideration={managementConsideration}
                  namespace={`managementConsiderations.${index}`}
                />
              ))
            )}

            <Dropdown
              trigger={
                <PrimaryButton
                  inverted
                  compact
                  style={{ marginTop: '10px' }}
                  type="button">
                  <Icon name="add circle" />
                  Add Consideration
                </PrimaryButton>
              }
              options={considerTypeOptions}
              icon={null}
              pointing="left"
              onChange={(e, { value }) => {
                push({
                  considerationTypeId: value,
                  detail: '',
                  url: ''
                })
              }}
              selectOnBlur={false}
            />
          </div>
        </div>
      )}
    />
  )
}

ManagementConsiderations.propTypes = {
  managementConsiderations: PropTypes.array.isRequired,
  namespace: PropTypes.string.isRequired
}

export default ManagementConsiderations
