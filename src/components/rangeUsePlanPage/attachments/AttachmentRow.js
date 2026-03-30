import React, { useState, useEffect, useRef } from 'react';
import { useFormikContext } from 'formik';
import { ATTACHMENTS } from '../../../constants/fields';
import PermissionsField, { IfEditable } from '../../common/PermissionsField';
import { formatDateFromServer, getUserFullName, axios, getAuthHeaderConfig } from '../../../utils';
import { Dropdown } from 'formik-semantic-ui';
import { TextField, PrimaryButton, Loading } from '../../common';
import { GET_SIGNED_DOWNLOAD_URL } from '../../../constants/api';
import { isUUID } from 'uuid-v4';

export const attachmentAccess = [
  {
    key: 'staff_only',
    value: 'staff_only',
    text: 'All staff',
  },
  {
    key: 'everyone',
    value: 'everyone',
    text: 'All staff and agreement holders',
  },
];

export const downloadAttachment = async (attachmentId, attachmentName, fileType) => {
  const res = await axios.get(GET_SIGNED_DOWNLOAD_URL(attachmentId, fileType), getAuthHeaderConfig());
  const fileRes = await axios.get(res.data.url, {
    responseType: 'blob',
    skipAuthorizationHeader: true,
  });
  const url = window.URL.createObjectURL(fileRes.data);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', decodeURIComponent(attachmentName));
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};

const AttachmentRow = ({ attachment, index, onDelete, onAccessChange, isUpdating, error, fileType }) => {
  const [isDownloading, setDownloading] = useState(false);
  const [errorDownloading, setErrorDownloading] = useState();
  const { values } = useFormikContext();
  const prevAccessRef = useRef(attachment.access);

  const formikIndex = values.files?.findIndex((f) => f.id === attachment.id);

  useEffect(() => {
    const currentAccess = values.files?.[formikIndex]?.access;
    if (currentAccess && currentAccess !== prevAccessRef.current && onAccessChange && !isUUID(attachment.id)) {
      onAccessChange(currentAccess);
      prevAccessRef.current = currentAccess;
    }
  }, [values.files, formikIndex, onAccessChange, attachment.id]);

  const handleDownload = async () => {
    setErrorDownloading(null);
    setDownloading(true);
    try {
      downloadAttachment(attachment.id, attachment.name, fileType);
    } catch (e) {
      setErrorDownloading(e);
    }
    setDownloading(false);
  };

  return (
    <div>
      <div className="rup__attachments__row">
        <TextField className="rup__attachments__filename" text={decodeURIComponent(attachment.name)} label={'Name'} />
        <div className="rup__attachments__details">
          <div className="rup__attachments__info">
            <TextField text={formatDateFromServer(attachment.createdAt)} label={'Upload Date'} />
            <TextField text={getUserFullName(attachment.user)} label="Uploaded By" />
            <PermissionsField
              permission={ATTACHMENTS.VIEWABLE_BY}
              inputProps={{ placeholder: 'All staff' }}
              name={`files.${index}.access`}
              component={Dropdown}
              options={attachmentAccess}
              label="Viewable by"
              displayValue={attachmentAccess.find((o) => o.value === attachment.access)?.text}
              fast
              fieldProps={{ required: false }}
            />
            {isUpdating && (
              <div style={{ marginLeft: '10px' }}>
                <Loading onlySpinner />
              </div>
            )}
            {!attachment.url && !attachment.error && <Loading onlySpinner />}
            {attachment.error && <span>Error uploading file: {attachment.error.message}</span>}
          </div>
          <div className="rup__attachments__actions">
            {attachment.url && !isUUID(attachment.id) && !isDownloading && (
              <div>
                <PrimaryButton inverted compact onClick={handleDownload} type="button">
                  <i className="download icon" />
                  Download
                </PrimaryButton>
                {errorDownloading && <span>There was an error downloading this file</span>}
              </div>
            )}
            <IfEditable permission={ATTACHMENTS.DELETE}>
              <PrimaryButton inverted compact onClick={onDelete} type="button">
                <i className="trash icon" />
                Delete
              </PrimaryButton>
            </IfEditable>
          </div>
        </div>
      </div>
      {error && <span className="sui-error-message rup__attachments__error">{error}</span>}
    </div>
  );
};

export default AttachmentRow;
