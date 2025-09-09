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
import { PrimaryButton } from '../../common';
import { axios, getAuthHeaderConfig } from '../../../utils';
import * as API from '../../../constants/api';
import AttachmentsList from '../versionsList/AttachmentsList';

const ExemptionDropdownList = ({ exemptions = [], open }) => {
  // const user = useUser();

  // const exemptionOptions = exemptions.map((v) => ({
  //   key: v.exemption,
  //   value: v,
  //   text: `v${v.exemption}`,
  //   exemption: v,
  // }));

  console.log(exemptions);

  const onDownloadClicked = async (exemption, agreementId) => {
    await axios
      .get(API.DOWNLOAD_AGREEMENT_EXEMPTION(agreementId, exemption.id), {
        ...getAuthHeaderConfig(),
        responseType: 'blob',
      })
      .then((response) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${agreementId}_v${exemption}.pdf`;
        link.style.display = 'none';
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();
      });
  };

  return (
    <TableRow>
      <TableCell colSpan={13} style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
        <Table>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={0} style={{ marginBottom: '10px' }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Exemption
                    {JSON.stringify(exemptions, 0, null)}
                  </Typography>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ color: 'grey', width: 175 }}>Reason</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Submited By</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Submission Date</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Approved By</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Approval Date</TableCell>
                        <TableCell style={{ color: 'grey', width: 175, align: 'left' }}>Status</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}></TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exemptions.map((exemption, index) => {
                        const [showAttachments, setShowAttachments] = useState(false);
                        return (
                          <React.Fragment key={index}>
                            <TableRow key={index}>
                              <TableCell>{exemption.reason}</TableCell>
                              <TableCell>{exemption.user}</TableCell>
                              <TableCell>
                                {exemption.createdAt ? moment(exemption.createdAt).format('MMM DD YYYY h:mm a') : ''}
                              </TableCell>
                              <TableCell>{exemption.approvedBy}</TableCell>
                              <TableCell>
                                {exemption.approvedAt === null
                                  ? ''
                                  : moment(exemption.approvedAt).format('MMM DD YYYY h:mm a')}
                              </TableCell>
                              <TableCell>{exemption.status}</TableCell>
                              <TableCell>
                                <PrimaryButton
                                  ui
                                  icon
                                  button
                                  inverted
                                  onClick={() => {
                                    onDownloadClicked(exemption.id, exemption.agreementId);
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
                                    <AttachmentsList attachments={exemption?.attachments} />
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          </React.Fragment>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </Table>
      </TableCell>
    </TableRow>
  );
};

export default ExemptionDropdownList;
