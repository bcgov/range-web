import { FieldArray, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { Confirm, Icon } from 'semantic-ui-react';
import uuid from 'uuid-v4';
import { deleteAttachment, getSignedUploadUrl } from '../../../api';
import { ATTACHMENTS } from '../../../constants/fields';
import { axios, getAuthHeaderConfig } from '../../../utils';
import { PrimaryButton } from '../../common';
import { IfEditable } from '../../common/PermissionsField';
import AttachmentRow from './AttachmentRow';
import * as API from '../../../constants/api';
import { ATTACHMENT_TYPE } from '../../../constants/variables';

const sortByDate = (a, b) => {
  if (b.uploadDate > a.uploadDate) return -1;
  if (b.uploadDate < a.uploadDate) return 1;
  return 0;
};

const Attachments = ({
  planId,
  attachments = [],
  label = '',
  propertyName,
  fetchPlan,
  fileType = ATTACHMENT_TYPE.PLAN_ATTACHMENT,
}) => {
  const [toRemove, setToRemove] = useState(null);
  const formik = useFormikContext();

  const saveAttachmentToDatabase = async (attachment) => {
    try {
      const { ...values } = attachment;
      const { data } = await axios.post(API.CREATE_RUP_ATTACHMENT(planId), values, getAuthHeaderConfig());
      return {
        ...attachment,
        id: data.id,
      };
    } catch (error) {
      console.error('Error saving attachment to database:', error);
      throw error;
    }
  };

  const handleUpload = async (file, attachment, index) => {
    const fieldName = `files.${index}`;
    try {
      // First upload the file to storage
      const signedUrl = await getSignedUploadUrl(encodeURIComponent(file.name));

      await axios.put(signedUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
        skipAuthorizationHeader: true,
      });

      // Update the attachment with the URL
      const updatedAttachment = {
        ...attachment,
        url: encodeURIComponent(file.name),
      };

      formik.setFieldValue(`${fieldName}.url`, encodeURIComponent(file.name));

      // Save attachment metadata directly to database if plan exists (not UUID)
      if (!uuid.isUUID(planId)) {
        try {
          const savedAttachment = await saveAttachmentToDatabase(updatedAttachment);

          // Update formik with the saved attachment ID
          formik.setFieldValue(`${fieldName}.id`, savedAttachment.id);
          formik.setFieldValue(fieldName, savedAttachment);

          // Refresh the plan to show the updated attachment
          if (fetchPlan) {
            await fetchPlan();
          }
        } catch (dbError) {
          // If saving to database fails, still keep the file in formik state
          // It will be saved when the plan is submitted
          console.warn('Failed to save attachment to database immediately, will save on plan submission:', dbError);
        }
      }
    } catch (e) {
      formik.setFieldValue(`${fieldName}.error`, e);
      throw e;
    }
  };

  return (
    <FieldArray
      name="files"
      render={({ push, remove }) => (
        <>
          <div className="rup__attachments">
            <div className="rup__attachments__title">{label} Attachments</div>
            <div className="rup__attachments__box">
              {attachments.filter((a) => a.type === propertyName).length === 0 ? (
                <div className="rup__attachments__no-content">No {label.toLocaleLowerCase()} attachments provided</div>
              ) : (
                attachments.sort(sortByDate).map((attachment, index) => {
                  if (attachment.type === propertyName) {
                    return (
                      <AttachmentRow
                        key={index}
                        attachment={attachment}
                        onDelete={() => setToRemove(attachment)}
                        fileType={fileType}
                        index={index}
                        error={formik.errors?.files?.[index]?.url}
                      />
                    );
                  }
                })
              )}
              <IfEditable permission={ATTACHMENTS.ADD}>
                <PrimaryButton inverted compact style={{ marginTop: '10px' }} type="button">
                  <Icon name="add circle" />
                  <label htmlFor={`fileInput${propertyName}`}>Add {label} Attachment</label>
                </PrimaryButton>
                <input
                  name={propertyName}
                  onChange={(event) => {
                    for (const [index, file] of Array.from(event.target.files).entries()) {
                      const attachment = {
                        name: encodeURIComponent(file.name),
                        createdAt: new Date(),
                        type: propertyName,
                        access: 'staff_only',
                        id: uuid(),
                      };

                      push(attachment);
                      handleUpload(file, attachment, attachments.length + index);
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
                setToRemove(null);
              }}
              onConfirm={async () => {
                if (!uuid.isUUID(toRemove.id)) {
                  await deleteAttachment(planId, toRemove.id);
                }

                // Find the index of the attachment in the formik files array
                const formikFiles = formik.values.files || [];
                const attachmentIndex = formikFiles.findIndex((file) => file.id === toRemove.id);

                if (attachmentIndex !== -1) {
                  remove(attachmentIndex);
                }

                setToRemove(null);

                // Refresh the plan to show updated attachments list
                if (fetchPlan) {
                  await fetchPlan();
                }
              }}
            />
          </div>
        </>
      )}
    />
  );
};

const AttachmentsHeader = () => (
  <>
    <div className="rup__content-title--editable">
      <div className="rup__content_title">Attachments</div>
    </div>
    <div className="rup__divider" />
  </>
);

export { Attachments, AttachmentsHeader };
