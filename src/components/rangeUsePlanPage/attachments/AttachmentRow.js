import React from 'react'
import { ATTACHMENTS } from '../../../constants/fields'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { Dropdown as PlainDropdown, Icon } from 'semantic-ui-react'
import { formatDateFromServer } from '../../../utils'
import { Dropdown, Form } from 'formik-semantic-ui'

const options = [
  {
    key: 'userOnly',
    value: 'userOnly',
    text: 'Just me'
  },
  {
    key: 'allStaff',
    value: 'allStaff',
    text: 'All staff'
  },
  {
    key: 'everyone',
    value: 'everyone',
    text: 'All staff and agreement holders'
  }
]

const AttachmentRow = ({ attachment, index, onDelete }) => (
  <div className="rup__attachments__row">
    <PermissionsField
      permission={ATTACHMENTS.FILENAME}
      name={ATTACHMENTS.FILENAME}
      displayValue={attachment.file.name}
      label={'Name'}
    />
    <PermissionsField
      permission={ATTACHMENTS.CREATED_AT}
      name={ATTACHMENTS.CREATED_AT}
      displayValue={formatDateFromServer(attachment.createdAt)}
      label={'Upload Date'}
    />
    <PermissionsField
      permission={ATTACHMENTS.CREATOR}
      name={ATTACHMENTS.CREATOR}
      displayValue={`${attachment.creator.givenName} ${attachment.creator.familyName}`}
      label={'Uploaded By'}
    />
    <PermissionsField
      permission={ATTACHMENTS.VIEWABLE_BY}
      inputProps={{ placeholder: 'Just me' }}
      name={`attachments[${index}].viewableBy`}
      component={Dropdown}
      options={options}
      label="Viewable by"
      fast
      fieldProps={{ required: false }}
    />
    <IfEditable permission={ATTACHMENTS}>
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

export default AttachmentRow
