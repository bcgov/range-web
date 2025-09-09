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
import { axios, getAuthHeaderConfig, isUserDecisionMaker } from '../../../utils';
import * as API from '../../../constants/api';
import AttachmentsList from '../versionsList/AttachmentsList';
import { useUser } from '../../../providers/UserProvider';
import { downloadAttachment } from '../attachments/AttachmentRow';
import { ATTACHMENT_TYPE } from '../../../constants/variables';

const ExemptionDropdownList = ({ exemptions = [], open }) => {
  const user = useUser();

  const onDownloadClicked = async (exemption) => {
    await axios
      .get(API.DOWNLOAD_AGREEMENT_EXEMPTION(exemption.agreementId, exemption.id), {
        ...getAuthHeaderConfig(),
      })
      .then((response) => {
        const blob = new Blob([Buffer.from(response.data, 'base64')], {
          type: 'application/pdf',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${exemption.agreementId}_Exemption${exemption.id}.pdf`;
        link.style.display = 'none';
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();

        exemption.attachments.forEach((attachment) => {
          downloadAttachment(attachment.id, attachment.name, ATTACHMENT_TYPE.EXEMPTION_ATTACHMENT);
        });
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
                            <TableRow key={index} hover={true}>
                              <TableCell>{exemption.reason}</TableCell>
                              <TableCell>
                                {exemption?.user.givenName} {exemption?.user.familyName}
                              </TableCell>
                              <TableCell>
                                {exemption.createdAt ? moment(exemption.createdAt).format('MMM DD YYYY h:mm a') : ''}
                              </TableCell>
                              <TableCell>{exemption.approvedBy}</TableCell>
                              <TableCell>
                                {exemption.approvedAt === null || exemption.approvedAt === undefined
                                  ? ''
                                  : moment(exemption.approvedAt).format('MMM DD YYYY h:mm a')}
                              </TableCell>
                              <TableCell>{exemption.status}</TableCell>
                              <TableCell>
                                <PrimaryButton
                                  icon
                                  inverted
                                  onClick={() => {
                                    onDownloadClicked(exemption);
                                  }}
                                >
                                  <i className="download icon" />
                                </PrimaryButton>
                              </TableCell>
                              <TableCell>
                                <PrimaryButton
                                  icon
                                  inverted
                                  onClick={() => {
                                    setShowAttachments(!showAttachments);
                                  }}
                                >
                                  <i className="paperclip icon" />
                                </PrimaryButton>
                              </TableCell>
                              {isUserDecisionMaker(user) && (
                                <TableCell>
                                  <PrimaryButton icon inverted onClick={() => {}}>
                                    <i className="x icon" />
                                  </PrimaryButton>
                                </TableCell>
                              )}
                            </TableRow>
                            <TableRow>
                              <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                                <Collapse in={showAttachments} timeout="auto" unmountOnExit>
                                  <Box margin={0} style={{ marginBottom: '10px' }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                      Attachments
                                    </Typography>
                                    <AttachmentsList
                                      attachments={exemption?.attachments}
                                      fileType={ATTACHMENT_TYPE.EXEMPTION_ATTACHMENT}
                                    />
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
