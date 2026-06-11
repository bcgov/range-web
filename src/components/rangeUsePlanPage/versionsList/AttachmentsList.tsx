import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import React from 'react';
import * as API from '../../../constants/api';
import { axios, getAuthHeaderConfig } from '../../../utils';
import { PrimaryButton } from '../../common/';
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
          <TableCell style={{ color: 'grey' }}>Name</TableCell>
          <TableCell style={{ color: 'grey' }}>Upload Date</TableCell>
          <TableCell style={{ color: 'grey' }}>Uploaded By</TableCell>
          <TableCell style={{ color: 'grey' }}>Viewable By</TableCell>
          <TableCell style={{ color: 'grey' }}></TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {attachments.map((attachment: any) => (
          <TableRow key={attachment.id} hover={true}>
            <TableCell>{attachment.name}</TableCell>
            <TableCell>{moment(attachment.createdAt).format('MMM DD YYYY h:mm a')}</TableCell>
            <TableCell>
              {attachment.user.givenName} {attachment.user.familyName}
            </TableCell>
            <TableCell>{attachmentAccess.find((o: any) => o.value === attachment.access)?.text}</TableCell>
            <TableCell>
              <PrimaryButton
                ui
                icon
                button
                inverted
                onClick={() => {
                  onDownloadClicked(attachment);
                }}
              >
                <i className="download icon" />
              </PrimaryButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AttachmentsList;
