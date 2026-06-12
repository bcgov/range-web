import React, { useState } from 'react';
import { generatePDF } from '../../../api';
import { PrimaryButton, MuiIcon } from '../../common';
import { downloadAttachment } from '../attachments/AttachmentRow';
import { ATTACHMENT_TYPE } from '../../../constants/variables';

interface MapAttachment {
  id: string | number;
  name: string;
}

interface PDFViewProps {
  match: { params: { planId: string } };
  agreementId: string;
  mapAttachments: MapAttachment[];
}

function PDFView({ match, agreementId, mapAttachments }: PDFViewProps) {
  const { planId } = match.params;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasError = !!error;

  const onDownloadClick = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await generatePDF(planId);
      const blob = new Blob([(response as any).data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${agreementId} - RUP`);
      document.body.appendChild(link);
      link.click();
      link.parentNode!.removeChild(link);
      setLoading(false);
      mapAttachments.forEach((attachment) => {
        downloadAttachment(attachment.id, attachment.name, ATTACHMENT_TYPE.PLAN_ATTACHMENT);
      });
    } catch (e: any) {
      setLoading(false);
      setError(e);
      console.error(e);
    }
  };

  return (
    <PrimaryButton
      icon
      negative={hasError}
      basic={hasError}
      loading={loading}
      onClick={() => {
        onDownloadClick();
      }}
    >
      <MuiIcon name="download" />
      {error ? `Error loading PDF. Click to retry` : 'Download PDF'}
    </PrimaryButton>
  );
}

export default PDFView;
