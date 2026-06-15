import { FieldArray, useFormikContext } from 'formik';
import React from 'react';
import uuid from 'uuid-v4';
import { deleteAttachment, getSignedUploadUrl } from '../../../api';
import { ATTACHMENTS } from '../../../constants/fields';
import { axios, getAuthHeaderConfig } from '../../../utils';
import { PrimaryButton, MuiIcon } from '../../common';
import { IfEditable } from '../../common/PermissionsField';
import AttachmentRow from './AttachmentRow';
import * as API from '../../../constants/api';
import { ATTACHMENT_TYPE } from '../../../constants/variables';
import useConfirm from '../../../providers/ConfrimationModalProvider';

const sortByDate = (a: any, b: any) => {
  if (b.createdAt > a.createdAt) return -1;
  if (b.createdAt < a.createdAt) return 1;
  return 0;
};

interface AttachmentsProps {
  planId: any;
  attachments?: any[];
  label?: string;
  propertyName: string;
  fileType?: string;
}

function Attachments({
  planId,
  attachments = [],
  label = '',
  propertyName,
  fileType = ATTACHMENT_TYPE.PLAN_ATTACHMENT,
}: AttachmentsProps) {
  const [updatingAccessId, setUpdatingAccessId] = React.useState<any>(null);
  const formik = useFormikContext<any>();
  const confirm = useConfirm()!;

  const refreshAttachments = async () => {
    try {
      const { data: plan } = await (axios.get as any)(API.GET_RUP(planId), getAuthHeaderConfig());
      formik.setFieldValue('files', plan.files || []);
    } catch (error) {
      console.error('Error refreshing attachments:', error);
    }
  };

  const updateAttachmentAccess = async (attachmentId: any, access: string) => {
    setUpdatingAccessId(attachmentId);
    try {
      await axios.put(API.UPDATE_RUP_ATTACHMENT(planId, attachmentId), { access }, getAuthHeaderConfig());
      if (!formik.dirty) formik.resetForm({ values: formik.values });
    } catch (error) {
      console.error('Error updating attachment access:', error);
    } finally {
      setUpdatingAccessId(null);
    }
  };

  const saveAttachmentToDatabase = async (attachment: any) => {
    try {
      const { ...values } = attachment;
      const { data } = await (axios.post as any)(API.CREATE_RUP_ATTACHMENT(planId), values, getAuthHeaderConfig());
      return { ...attachment, id: data.id, user: data.user, createdAt: data.createdAt };
    } catch (error) {
      console.error('Error saving attachment to database:', error);
      throw error;
    }
  };

  const handleUpload = async (file: File, attachment: any, index: number) => {
    const fieldName = `files.${index}`;
    try {
      const signedUrl = await getSignedUploadUrl(encodeURIComponent(file.name));
      await axios.put(signedUrl, file, {
        headers: { 'Content-Type': file.type },
        skipAuthorizationHeader: true,
      } as any);

      const updatedAttachment = { ...attachment, url: encodeURIComponent(file.name) };
      formik.setFieldValue(`${fieldName}.url`, encodeURIComponent(file.name));

      if (!uuid.isUUID(planId)) {
        try {
          const savedAttachment = await saveAttachmentToDatabase(updatedAttachment);
          formik.setFieldValue(`${fieldName}.id`, savedAttachment.id);
          formik.setFieldValue(fieldName, savedAttachment);
          if (!formik.dirty) formik.resetForm({ values: formik.values });
          await refreshAttachments();
        } catch (dbError) {
          console.warn('Failed to save attachment to database immediately:', dbError);
        }
      }
    } catch (e) {
      formik.setFieldValue(`${fieldName}.error`, e);
      throw e;
    }
  };

  const handleDelete = async (attachment: any, index: number, remove: (i: number) => void) => {
    const choice = await confirm({ titleText: 'Delete attachment', contentText: 'Are you sure?' });
    if (!choice) return;

    if (!uuid.isUUID(attachment.id)) {
      await deleteAttachment(planId, attachment.id);
    }

    remove(index);
    if (!formik.dirty) formik.resetForm({ values: formik.values });
    if (!uuid.isUUID(planId)) await refreshAttachments();
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
                attachments
                  .sort(sortByDate)
                  .map((attachment, index) =>
                    attachment.type === propertyName ? (
                      <AttachmentRow
                        key={index}
                        attachment={attachment}
                        onDelete={() => handleDelete(attachment, index, remove)}
                        onAccessChange={(access) => updateAttachmentAccess(attachment.id, access)}
                        isUpdating={updatingAccessId === attachment.id}
                        fileType={fileType}
                        index={index}
                        error={(formik.errors as any)?.files?.[index]?.url}
                      />
                    ) : null,
                  )
              )}
              <IfEditable permission={ATTACHMENTS.ADD}>
                <PrimaryButton style={{ marginTop: '10px' }} type="button" startIcon={<MuiIcon name="add circle" />}>
                  <label htmlFor={`fileInput${propertyName}`}>Add {label} Attachment</label>
                </PrimaryButton>
                <input
                  name={propertyName}
                  onChange={(event) => {
                    for (const [index, file] of Array.from(event.target.files!).entries()) {
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
          </div>
        </>
      )}
    />
  );
}

function AttachmentsHeader() {
  return (
    <>
      <div className="rup__content-title--editable">
        <div className="rup__content_title">Attachments</div>
      </div>
      <div className="rup__divider" />
    </>
  );
}

export { Attachments, AttachmentsHeader };
