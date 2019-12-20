import React from 'react'
import { ATTACHMENTS } from '../../../constants/fields'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { Dropdown, Icon } from 'semantic-ui-react'
import { formatDateFromServer } from '../../../utils'

const AttachmentRow = ({ attachment, onDelete }) => (
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
    <IfEditable permission={ATTACHMENTS}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 15
        }}>
        <Dropdown
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
