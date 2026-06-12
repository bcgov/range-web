import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import React from 'react';
import * as API from '../../../constants/api';
import { axios, getAuthHeaderConfig } from '../../../utils';
import { PrimaryButton, MuiIcon } from '../../common/';
import { attachmentAccess } from '../attachments/AttachmentRow';
import { ATTACHMENT_TYPE } from '../../../constants/variables';

interface AttachmentsListProps {
  attachments: any[];
  fileType?: string;
}

const AttachmentsList = ({ attachments, fileType = ATTACHMENT_TYPE.PLAN_ATTACHMENT }: AttachmentsListProps) => {
  if (!attachments || attachments.length === 0) {
    return (
      <Typography variant="body2" color="textSecondary">
        No attachments available
      </Typography>
    );
  }

  const onDownloadClicked = async (attachment: any) => {
    try {
      const res = await axios.get(API.GET_SIGNED_DOWNLOAD_URL(attachment.id, fileType), getAuthHeaderConfig());
      const fileRes = await axios.get(res.data.url, {
        responseType: 'blob',
        skipAuthorizationHeader: true,
      } as any);

      const url = window.URL.createObjectURL(fileRes.data);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', attachment.name);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (e: any) {
      console.log(`Error downloading file ${e.toString()}`);
    }
  };

  return (
    <Table size="small" aria-label="dates">
      <TableHead>
        <TableRow>
          <TableCell sx={{ color: 'grey' }}>Name</TableCell>
          <TableCell sx={{ color: 'grey' }}>Upload Date</TableCell>
          <TableCell sx={{ color: 'grey' }}>Uploaded By</TableCell>
          <TableCell sx={{ color: 'grey' }}>Viewable By</TableCell>
          <TableCell sx={{ color: 'grey' }}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attachments.map((attachment: any) => (
          <TableRow key={attachment.id} hover>
            <TableCell>{attachment.name}</TableCell>
            <TableCell>{moment(attachment.createdAt).format('MMM DD YYYY h:mm a')}</TableCell>
            <TableCell>
              {attachment.user.givenName} {attachment.user.familyName}
            </TableCell>
            <TableCell>{attachmentAccess.find((o: any) => o.value === attachment.access)?.text}</TableCell>
            <TableCell>
              <PrimaryButton
                inverted
                onClick={() => {
                  onDownloadClicked(attachment);
                }}
              >
                <MuiIcon name="download" />
              </PrimaryButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttachmentsList;
