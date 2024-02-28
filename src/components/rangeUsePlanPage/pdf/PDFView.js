import React, { useState } from 'react';
import { generatePDF } from '../../../api';
import { PrimaryButton } from '../../common';
import { downloadAttachment } from '../attachments/AttachmentRow';

const PDFView = ({ match, agreementId, mapAttachments }) => {
  const { planId } = match.params;
  const hasError = !!error;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const onDownloadClick = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await generatePDF(planId);
      const blob = new Blob([Buffer.from(response.data, 'base64')], {
        type: 'application/pdf',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', agreementId);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setLoading(false);
      mapAttachments.forEach((attachment) => {
        downloadAttachment(attachment.id, attachment.name);
      });
    } catch (e) {
      setLoading(false);
      setError(e);
      console.error(e);
    }
  };

  return (
    <PrimaryButton
      ui
      icon
      button
      negative={hasError}
      basic={hasError}
      loading={loading}
      onClick={() => {
        onDownloadClick();
      }}
    >
      <i className="download icon" />
      {error ? `Error loading PDF. Click to retry` : 'Download PDF'}
    </PrimaryButton>
  );
};

export default PDFView;
