import React, { useState } from 'react'
import uuid from 'uuid-v4'
import { FieldArray } from 'formik'
import { Button, Confirm } from 'semantic-ui-react'
import AttachmentRow from './AttachmentRow'
import { IfEditable } from '../../common/PermissionsField'

import { useUser } from '../../../providers/UserProvider'
import { deleteAttachment } from '../../../api'

import { ATTACHMENTS } from '../../../constants/fields'

const sortByDate = (a, b) => {
  if (b.uploadDate > a.uploadDate) return -1
  if (b.uploadDate < a.uploadDate) return 1
  return 0
}

const Attachments = ({ attachments = [] }) => {
  const [toRemove, setToRemove] = useState(null)
  const user = useUser()

  return (
    <FieldArray
      name="attachments"
      render={({ push, remove }) => (
        <div className="rup__attachments">
          <div className="rup__content-title--editable">
            <div className="rup__content_title">Attachments</div>
            <IfEditable permission={ATTACHMENTS}>
              <Button
                type="button"
                basic
                primary
                className="icon labeled rup__add-button">
                <i className="add circle icon" />
                <label htmlFor="fileInput">Add Attachment</label>
              </Button>
              <input
                onChange={event => {
                  push({
                    file: event.target.files[0],
                    createdAt: new Date(),
                    creator: user
                  })
                }}
                id="fileInput"
                className="rup__attachments__file-button"
                type="file"
              />
            </IfEditable>
          </div>
          <div className="rup__divider" />
          <div className="rup__attachments__box">
            {attachments.length === 0 ? (
              <div className="rup__attachments__no-content">
                No attachments provided
              </div>
            ) : (
              attachments
                .sort(sortByDate)
                .map((attachment, index) => (
                  <AttachmentRow
                    key={attachment.id}
                    attachment={attachment}
                    onDelete={() => setToRemove(index)}
                  />
                ))
            )}
          </div>

          <Confirm
            open={toRemove !== null}
            onCancel={() => {
              setToRemove(null)
            }}
            onConfirm={async () => {
              const attachment = attachments[toRemove]

              if (!uuid.isUUID(attachment.id)) {
                await deleteAttachment(attachment.id)
              }

              remove(toRemove)
              setToRemove(null)
            }}
          />
        </div>
      )}
    />
  )
}

export default Attachments
