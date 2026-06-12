import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import classnames from 'classnames';
import Status from '../../common/Status';
import { useUser } from '../../../providers/UserProvider';
import { PrimaryButton, MuiIcon } from '../../common/';
import { axios, getAuthHeaderConfig } from '../../../utils';
import * as API from '../../../constants/api';
import AttachmentsList from './AttachmentsList';
import { ATTACHMENT_TYPE } from '../../../constants/variables';

interface VersionsDropdownListProps {
  versions: any[];
  open: boolean;
  planId?: any;
  selectedVersion?: any;
  onSelectVersion?: (e: any, data: any) => void;
}

const VersionRow = ({ option, user }: { option: any; user: any }) => {
  const [showAttachments, setShowAttachments] = useState(false);

  const onDownloadClicked = async (planId: any, version: any, agreementId: string) => {
    await axios
      .get(API.DOWNLOAD_RUP_VERSION(planId, version), {
        ...getAuthHeaderConfig(),
        responseType: 'blob',
      })
      .then((response: any) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${agreementId}_v${version}.pdf`;
        link.style.display = 'none';
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
      });
  };

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell>{option.version.amendmentType}</TableCell>
        <TableCell>{option.version.submittedBy}</TableCell>
        <TableCell>
          {option.version.createdAt ? moment(option.version.createdAt).format('MMM DD YYYY h:mm a') : ''}
        </TableCell>
        <TableCell>{option.version.approvedBy}</TableCell>
        <TableCell>
          {option.version.approvedAt === null ? '' : moment(option.version.approvedAt).format('MMM DD YYYY h:mm a')}
        </TableCell>
        <TableCell>
          <Status
            className={classnames('versions_status_icon', {
              greyed: option.version.isCurrentLegalVersion !== true,
            })}
            status={option.version.snapshot.status}
            user={user}
          />
        </TableCell>
        <TableCell>
          <PrimaryButton
            inverted
            onClick={() => {
              onDownloadClicked(option.version.planId, option.version.version, option.version.snapshot.agreementId);
            }}
          >
            <MuiIcon name="download" />
          </PrimaryButton>
        </TableCell>
        <TableCell>
          <PrimaryButton
            inverted
            onClick={() => {
              setShowAttachments(!showAttachments);
            }}
          >
            <MuiIcon name="paperclip" />
          </PrimaryButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={showAttachments} timeout="auto" unmountOnExit>
            <Box margin={0} style={{ marginBottom: '10px' }}>
              <Typography variant="h6" gutterBottom component="div">
                Attachments
              </Typography>
              <AttachmentsList attachments={option.version.snapshot.files} fileType={ATTACHMENT_TYPE.PLAN_ATTACHMENT} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const VersionsDropdownList = ({ versions, open }: VersionsDropdownListProps) => {
  const user = useUser();

  const versionOptions = versions.map((v: any) => ({
    key: v.version,
    value: v,
    text: `v${v.version}`,
    version: v,
  }));

  return (
    <TableRow>
      <TableCell colSpan={13} style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <Box margin={0} style={{ marginBottom: '10px' }}>
                    <Typography variant="h6" gutterBottom component="div">
                      Versions
                    </Typography>
                    <Table size="small" aria-label="dates">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'grey', width: 175 }}>Reason</TableCell>
                          <TableCell sx={{ color: 'grey', width: 175 }}>Submited By</TableCell>
                          <TableCell sx={{ color: 'grey', width: 175 }}>Submission Date</TableCell>
                          <TableCell sx={{ color: 'grey', width: 175 }}>Approved By</TableCell>
                          <TableCell sx={{ color: 'grey', width: 175 }}>Approval Date</TableCell>
                          <TableCell sx={{ color: 'grey', width: 175, textAlign: 'left' }}>Status</TableCell>
                          <TableCell sx={{ color: 'grey', width: 175 }}></TableCell>
                          <TableCell sx={{ color: 'grey', width: 175 }}></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {versionOptions.map((option: any, index: number) => (
                          <VersionRow key={index} option={option} user={user} />
                        ))}
                      </TableBody>
                    </Table>
                  </Box>
                </Collapse>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableCell>
    </TableRow>
  );
};

export default VersionsDropdownList;
