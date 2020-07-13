import React, { useState } from 'react'
import uuid from 'uuid-v4'
import { Icon, Confirm } from 'semantic-ui-react'
import { PrimaryButton } from '../../common'
import { IfEditable } from '../../common/PermissionsField'
import { FieldArray } from 'formik'
import AttachmentRow from './AttachmentRow'
import { useUser } from '../../../providers/UserProvider'
import { deleteAttachment } from '../../../api'
import { ATTACHMENTS } from '../../../constants/fields'

const sortByDate = (a, b) => {
  if (b.uploadDate > a.uploadDate) return -1
  if (b.uploadDate < a.uploadDate) return 1
  return 0
}

const Attachments = ({ attachments = [], label = '', propertyName }) => {
  const [toRemove, setToRemove] = useState(null)
  const user = useUser()

  console.log('propertyName')
  console.log(propertyName)

  return (
    <FieldArray
      name="attachments"
      render={({ push, remove }) => (
        <>
          <div className="rup__attachments">
            <div className="rup__attachments__box">
              {attachments.length === 0 ? (
                <div className="rup__attachments__no-content">
                  No {label.toLocaleLowerCase()} attachments provided
                </div>
              ) : (
                attachments.sort(sortByDate).map((attachment, index) => {
                  if (attachment.type === propertyName) {
                    return (
                      <AttachmentRow
                        key={index}
                        attachment={attachment}
                        onDelete={() => setToRemove(index)}
                        index={index}
                      />
                    )
                  }
                })
              )}
              <IfEditable permission={ATTACHMENTS}>
                <PrimaryButton
                  inverted
                  compact
                  style={{ marginTop: '10px' }}
                  type="button">
                  <Icon name="add circle" />
                  <label htmlFor={`fileInput${propertyName}`}>
                    Add {label} Attachment
                  </label>
                </PrimaryButton>
                <input
                  name={propertyName}
                  onChange={event => {
                    push({
                      file: event.target.files[0],
                      createdAt: new Date(),
                      creator: user,
                      type: propertyName
                    })
                  }}
                  id={`fileInput${propertyName}`}
                  className="rup__attachments__file-button"
                  type="file"
                />
              </IfEditable>
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
        </>
      )}
    />
  )
}

const AttachmentsHeader = () => (
  <>
    <div className="rup__content-title--editable">
      <div className="rup__content_title">Attachments</div>
    </div>
    <div className="rup__divider" />
  </>
)

export { Attachments, AttachmentsHeader }
