import React, { useState } from 'react';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import CircularProgress from '@material-ui/core/CircularProgress';
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
import { useUser } from '../../../providers/UserProvider';
import { isUserDecisionMaker, isUserAdmin } from '../../../utils/helper/user';
import useConfirm from '../../../providers/ConfrimationModalProvider';
import { downloadAttachment } from '../attachments/AttachmentRow';
import { ATTACHMENT_TYPE, EXEMPTION_STATUS } from '../../../constants/variables';

const ExemptionDropdownList = ({ exemptions = [], open, onExemptionUpdate, onEditExemption }) => {
  const user = useUser();
  const confirm = useConfirm();
  const isAdminOrDecisionMaker = isUserDecisionMaker(user) || isUserAdmin(user);
  const [submittingId, setSubmittingId] = useState(null);
  const [error, setError] = useState(null);

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

  const onTransitionClicked = async (exemption, action) => {
    const actionTexts = {
      approve: 'Approve',
      reject: 'Reject',
      cancel: 'Cancel',
    };

    const choice = await confirm({
      titleText: `${actionTexts[action]} Exemption`,
      contentText: `Are you sure you want to ${action.toLowerCase()} this exemption?`,
      confirmText: actionTexts[action],
      cancelText: 'Back',
    });

    if (!choice) return;

    setSubmittingId(exemption.id);
    setError(null);
    try {
      await axios.post(
        API.TRANSITION_EXEMPTION(exemption.agreementId, exemption.id),
        { action, comment: '' },
        { ...getAuthHeaderConfig() },
      );
      if (onExemptionUpdate) {
        onExemptionUpdate();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to perform action');
      console.error('Error transitioning exemption:', err);
    } finally {
      setSubmittingId(null);
    }
  };

  return (
    <TableRow>
      <TableCell
        colSpan={isAdminOrDecisionMaker ? 14 : 12}
        style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}
      >
        <Table>
          <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box margin={0} style={{ marginBottom: '10px' }}>
                  <Typography variant="h6" gutterBottom component="div">
                    Exemption
                  </Typography>
                  {error && (
                    <Typography style={{ color: 'red', marginBottom: '10px' }} variant="body2">
                      {error}
                    </Typography>
                  )}
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell style={{ color: 'grey', width: 175 }}>Reason</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Submited By</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Submission Date</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Start Date</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>End Date</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Approved By</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Approval Date</TableCell>
                        <TableCell style={{ color: 'grey', width: 175, align: 'left' }}>Status</TableCell>
                        <TableCell style={{ color: 'grey', width: 175 }}>Download</TableCell>
                        {isAdminOrDecisionMaker && (
                          <>
                            <TableCell style={{ color: 'grey', width: 175 }}>Approve/Reject</TableCell>
                            <TableCell style={{ color: 'grey', width: 175 }}>View/Edit</TableCell>
                            <TableCell style={{ color: 'grey', width: 175 }}>Cancel</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exemptions.map((exemption, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow key={index} hover={true}>
                              <TableCell>{exemption.reason}</TableCell>
                              <TableCell>
                                {exemption?.user.givenName} {exemption?.user.familyName}
                              </TableCell>
                              <TableCell>
                                {exemption.createdAt ? moment(exemption.createdAt).format('MMM DD YYYY') : ''}
                              </TableCell>
                              <TableCell>
                                {exemption.startDate ? moment(exemption.startDate).format('MMM DD YYYY') : ''}
                              </TableCell>
                              <TableCell>
                                {exemption.endDate ? moment(exemption.endDate).format('MMM DD YYYY') : ''}
                              </TableCell>
                              <TableCell>
                                {exemption.approvedByUser
                                  ? `${exemption.approvedByUser.givenName} ${exemption.approvedByUser.familyName}`
                                  : exemption.approvedBy}
                              </TableCell>
                              <TableCell>
                                {exemption.approvalDate
                                  ? moment(exemption.approvalDate).format('MMM DD YYYY')
                                  : exemption.approvedAt
                                    ? moment(exemption.approvedAt).format('MMM DD YYYY')
                                    : ''}
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
                              {isAdminOrDecisionMaker && (
                                <>
                                  <TableCell>
                                    {exemption.status === EXEMPTION_STATUS.PENDING_APPROVAL &&
                                      (submittingId === exemption.id ? (
                                        <CircularProgress size={24} />
                                      ) : (
                                        <>
                                          <PrimaryButton
                                            icon
                                            inverted
                                            onClick={() => onTransitionClicked(exemption, 'approve')}
                                          >
                                            <i className="thumbs up icon" />
                                          </PrimaryButton>
                                          <PrimaryButton
                                            icon
                                            inverted
                                            onClick={() => onTransitionClicked(exemption, 'reject')}
                                          >
                                            <i className="thumbs down icon" />
                                          </PrimaryButton>
                                        </>
                                      ))}
                                  </TableCell>
                                  <TableCell>
                                    {exemption.status === EXEMPTION_STATUS.REJECTED ||
                                    (isAdminOrDecisionMaker &&
                                      exemption.status === EXEMPTION_STATUS.PENDING_APPROVAL) ? (
                                      submittingId === exemption.id ? (
                                        <CircularProgress size={24} />
                                      ) : (
                                        <PrimaryButton
                                          icon
                                          inverted
                                          onClick={() => onEditExemption && onEditExemption(exemption)}
                                        >
                                          <i className="edit icon" />
                                        </PrimaryButton>
                                      )
                                    ) : (
                                      <PrimaryButton
                                        icon
                                        inverted
                                        onClick={() =>
                                          onEditExemption && onEditExemption({ ...exemption, viewOnly: true })
                                        }
                                      >
                                        <i className="eye icon" />
                                      </PrimaryButton>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {exemption.status !== EXEMPTION_STATUS.CANCELLED &&
                                      (submittingId === exemption.id ? (
                                        <CircularProgress size={24} />
                                      ) : (
                                        <PrimaryButton
                                          icon
                                          inverted
                                          onClick={() => onTransitionClicked(exemption, 'cancel')}
                                        >
                                          <i className="x icon" />
                                        </PrimaryButton>
                                      ))}
                                  </TableCell>
                                </>
                              )}
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
