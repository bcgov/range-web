import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import classnames from 'classnames';
import Status from '../../common/Status';
import { useUser } from '../../../providers/UserProvider';
import { PrimaryButton } from '../../common/';
import { axios, getAuthHeaderConfig } from '../../../utils';
import * as API from '../../../constants/api';
import AttachmentsList from './AttachmentsList';

const VersionsDropdownList = ({ versions, open }) => {
  const user = useUser();

  const versionOptions = versions.map((v) => ({
    key: v.version,
    value: v,
    text: `v${v.version}`,
    version: v,
  }));

  const onDownloadClicked = async (planId, version, agreementId) => {
    await axios
      .get(API.DOWNLOAD_RUP_VERSION(planId, version), {
        ...getAuthHeaderConfig(),
        responseType: 'blob',
      })
      .then((response) => {
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
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box margin={0} style={{ marginBottom: '10px' }}>
            <Typography variant="h6" gutterBottom component="div">
              Versions
            </Typography>
            <Table size="small" aria-label="dates">
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: 'grey' }}>Reason</TableCell>
                  <TableCell style={{ color: 'grey' }}>Originally Approved By</TableCell>
                  <TableCell style={{ color: 'grey' }}>Original Approval Date</TableCell>
                  <TableCell style={{ color: 'grey', align: 'left' }}>Status</TableCell>
                  <TableCell style={{ color: 'grey' }}></TableCell>
                  <TableCell style={{ color: 'grey' }}></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {versionOptions.map((option, index) => {
                  const [showAttachments, setShowAttachments] = useState(false);
                  return (
                    <>
                      <TableRow key={index} hover={true}>
                        <TableCell>{option.version.legalReason}</TableCell>
                        <TableCell>
                          {option.version.snapshot.originalApproval == null
                            ? ''
                            : option.version.snapshot.originalApproval.givenName +
                              ' ' +
                              option.version.snapshot.originalApproval.familyName}
                        </TableCell>
                        <TableCell>
                          {option.version.snapshot.originalApproval == null
                            ? ''
                            : moment(option.version.snapshot.originalApproval.createdAt).format('MMM DD YYYY h:mm a')}
                        </TableCell>
                        <TableCell>
                          <Status
                            className={classnames('versions_status_icon', {
                              greyed: option.version.isCurrentLegalVersion === false,
                            })}
                            status={option.version.snapshot.status}
                            user={user}
                          />
                        </TableCell>
                        <TableCell>
                          <PrimaryButton
                            ui
                            icon
                            button
                            inverted
                            onClick={() => {
                              onDownloadClicked(
                                option.version.planId,
                                option.version.version,
                                option.version.snapshot.agreementId,
                              );
                            }}
                          >
                            <i className="download icon" />
                          </PrimaryButton>
                        </TableCell>
                        <TableCell>
                          <PrimaryButton
                            ui
                            icon
                            button
                            inverted
                            onClick={() => {
                              setShowAttachments(!showAttachments);
                            }}
                          >
                            <i className="paperclip icon" />
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
                              <AttachmentsList attachments={option.version.snapshot.files} />
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default VersionsDropdownList;
