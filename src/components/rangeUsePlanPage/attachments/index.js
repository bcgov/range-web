import React, { useState, useEffect } from 'react'
import uuid from 'uuid-v4'
import { Icon, Confirm } from 'semantic-ui-react'
import { PrimaryButton } from '../../common'
import { IfEditable } from '../../common/PermissionsField'
import { FieldArray, useFormikContext } from 'formik'
import AttachmentRow from './AttachmentRow'
import { useUser } from '../../../providers/UserProvider'
import { deleteAttachment, getSignedUploadUrl } from '../../../api'
import { ATTACHMENTS } from '../../../constants/fields'
import { axios } from '../../../utils'

const sortByDate = (a, b) => {
  if (b.uploadDate > a.uploadDate) return -1
  if (b.uploadDate < a.uploadDate) return 1
  return 0
}

const Attachments = ({
  planId,
  attachments = [],
  label = '',
  propertyName
}) => {
  const [toRemove, setToRemove] = useState(null)
  const formik = useFormikContext()

  const handleUpload = async (file, attachment, index) => {
    const fieldName = `files.${index}`
    try {
      const signedUrl = await getSignedUploadUrl(file.name)
      const formData = new FormData()
      formData.append(file.name, file)
      await axios.put(signedUrl, formData)

      formik.setFieldValue(`${fieldName}.url`, file.name)
    } catch (e) {
      formik.setFieldValue(`${fieldName}.error`, e)
    }
  }

  return (
    <FieldArray
      name="files"
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
                        error={formik.errors?.files?.[index]?.url}
                      />
                    )
                  }
                })
              )}
              <IfEditable permission={ATTACHMENTS.ADD}>
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
                    for (const [index, file] of Array.from(
                      event.target.files
                    ).entries()) {
                      const attachment = {
                        name: file.name,
                        createdAt: new Date(),
                        type: propertyName,
                        access: 'staff_only',
                        id: uuid()
                      }

                      push(attachment)
                      handleUpload(file, attachment, attachments.length + index)
                    }
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
                  await deleteAttachment(planId, attachment.id)
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
