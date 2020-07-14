import React, { useState } from 'react'
import { ATTACHMENTS } from '../../../constants/fields'
import PermissionsField, { IfEditable } from '../../common/PermissionsField'
import { Dropdown as PlainDropdown, Icon } from 'semantic-ui-react'
import {
  formatDateFromServer,
  getUserFullName,
  axios,
  getAuthHeaderConfig
} from '../../../utils'
import { Dropdown } from 'formik-semantic-ui'
import { TextField } from '../../common'
import { CircularProgress } from '@material-ui/core'
import { GET_SIGNED_DOWNLOAD_URL } from '../../../constants/api'

const options = [
  {
    key: 'user_only',
    value: 'user_only',
    text: 'Just me'
  },
  {
    key: 'staff_only',
    value: 'staff_only',
    text: 'All staff'
  },
  {
    key: 'everyone',
    value: 'everyone',
    text: 'All staff and agreement holders'
  }
]

const AttachmentRow = ({ attachment, index, onDelete, error }) => {
  const [isDownloading, setDownloading] = useState(false)
  const [errorDownloading, setErrorDownloading] = useState()

  const handleDownload = async () => {
    setErrorDownloading(null)
    setDownloading(true)
    try {
      const res = await axios.get(
        GET_SIGNED_DOWNLOAD_URL(attachment.id),
        getAuthHeaderConfig()
      )
      window.open(res.data.url)
    } catch (e) {
      setErrorDownloading(e)
    }

    setDownloading(false)
  }

  return (
    <div>
      <div className="rup__attachments__row">
        <TextField text={attachment.name} label={'Name'} />
        <TextField
          text={formatDateFromServer(attachment.createdAt)}
          label={'Upload Date'}
        />
        <TextField
          text={getUserFullName(attachment.user)}
          label="Uploaded By"
        />
        <PermissionsField
          permission={ATTACHMENTS.VIEWABLE_BY}
          inputProps={{ placeholder: 'Just me' }}
          name={`files.${index}.access`}
          component={Dropdown}
          options={options}
          label="Viewable by"
          displayValue={options.find(o => o.value === attachment.access)?.text}
          fast
          fieldProps={{ required: false }}
        />
        {!attachment.url && !attachment.error && <CircularProgress />}
        {attachment.error && (
          <span>Error uploading file: {attachment.error.message}</span>
        )}
        {attachment.url && !isDownloading && (
          <div>
            <button onClick={handleDownload}>Download</button>
            {errorDownloading && (
              <span>There was an error downloading this file</span>
            )}
          </div>
        )}
        <IfEditable permission={ATTACHMENTS.DELETE}>
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
      {error && (
        <span className="sui-error-message rup__attachments__error">
          {error}
        </span>
      )}
    </div>
  )
}

export default AttachmentRow
