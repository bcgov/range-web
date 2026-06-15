import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import CircularProgress from '@mui/material/CircularProgress';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import { PrimaryButton, MuiIcon } from '../../common';
import { axios, getAuthHeaderConfig } from '../../../utils';
import * as API from '../../../constants/api';
import { useUser } from '../../../providers/UserProvider';
import { isUserDecisionMaker, isUserAdmin } from '../../../utils/helper/user';
import useConfirm from '../../../providers/ConfrimationModalProvider';
import { downloadAttachment } from '../attachments/AttachmentRow';
import { ATTACHMENT_TYPE, EXEMPTION_STATUS } from '../../../constants/variables';

interface ExemptionDropdownListProps {
  exemptions?: any[];
  open: boolean;
  onExemptionUpdate?: () => void;
  onEditExemption?: (exemption: any) => void;
}

function ExemptionDropdownList({
  exemptions = [],
  open,
  onExemptionUpdate,
  onEditExemption,
}: ExemptionDropdownListProps) {
  const user = useUser();
  const confirm = useConfirm()!;
  const isAdminOrDecisionMaker = isUserDecisionMaker(user) || isUserAdmin(user);
  const [submittingId, setSubmittingId] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const onDownloadClicked = async (exemption: any) => {
    await axios
      .get(API.DOWNLOAD_AGREEMENT_EXEMPTION(exemption.agreementId, exemption.id), {
        ...getAuthHeaderConfig(),
        responseType: 'blob',
      })
      .then((response: any) => {
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${exemption.agreementId}_Exemption${exemption.id}.pdf`;
        link.style.display = 'none';
        link.click();
        window.URL.revokeObjectURL(url);
        link.remove();

        exemption.attachments.forEach((attachment: any) => {
          downloadAttachment(attachment.id, attachment.name, ATTACHMENT_TYPE.EXEMPTION_ATTACHMENT);
        });
      });
  };

  const onTransitionClicked = async (exemption: any, action: string) => {
    const actionTexts: Record<string, string> = {
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
    } catch (err: any) {
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
                    <Typography sx={{ color: 'red', mb: '10px' }} variant="body2">
                      {error}
                    </Typography>
                  )}
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: 'grey', width: 175 }}>Reason</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175 }}>Submited By</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175 }}>Submission Date</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175 }}>Start Date</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175 }}>End Date</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175 }}>Approved By</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175 }}>Approval Date</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175, textAlign: 'left' }}>Status</TableCell>
                        <TableCell sx={{ color: 'grey', width: 175 }}>Download</TableCell>
                        {isAdminOrDecisionMaker && (
                          <>
                            <TableCell sx={{ color: 'grey', width: 175 }}>Approve/Reject</TableCell>
                            <TableCell sx={{ color: 'grey', width: 175 }}>View/Edit</TableCell>
                            <TableCell sx={{ color: 'grey', width: 175 }}>Cancel</TableCell>
                          </>
                        )}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {exemptions.map((exemption: any, index: number) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow hover>
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
                                  variant="outlined"
                                  onClick={() => {
                                    onDownloadClicked(exemption);
                                  }}
                                >
                                  <MuiIcon name="download" />
                                </PrimaryButton>
                              </TableCell>
                              {isAdminOrDecisionMaker && (
                                <>
                                  <TableCell>
                                    {(exemption.status === EXEMPTION_STATUS.PENDING_APPROVAL ||
                                      exemption.status === EXEMPTION_STATUS.IN_PROGRESS) &&
                                      (submittingId === exemption.id ? (
                                        <CircularProgress size={24} />
                                      ) : (
                                        <>
                                          <PrimaryButton
                                            variant="outlined"
                                            onClick={() => onTransitionClicked(exemption, 'approve')}
                                          >
                                            <MuiIcon name="thumbs up" />
                                          </PrimaryButton>
                                          <PrimaryButton
                                            variant="outlined"
                                            onClick={() => onTransitionClicked(exemption, 'reject')}
                                          >
                                            <MuiIcon name="thumbs down" />
                                          </PrimaryButton>
                                        </>
                                      ))}
                                  </TableCell>
                                  <TableCell>
                                    {exemption.status === EXEMPTION_STATUS.REJECTED ||
                                    (isAdminOrDecisionMaker &&
                                      (exemption.status === EXEMPTION_STATUS.PENDING_APPROVAL ||
                                        exemption.status === EXEMPTION_STATUS.IN_PROGRESS)) ? (
                                      submittingId === exemption.id ? (
                                        <CircularProgress size={24} />
                                      ) : (
                                        <PrimaryButton
                                          variant="outlined"
                                          onClick={() => onEditExemption && onEditExemption(exemption)}
                                        >
                                          <MuiIcon name="edit" />
                                        </PrimaryButton>
                                      )
                                    ) : (
                                      <PrimaryButton
                                        variant="outlined"
                                        onClick={() =>
                                          onEditExemption && onEditExemption({ ...exemption, viewOnly: true })
                                        }
                                      >
                                        <MuiIcon name="eye" />
                                      </PrimaryButton>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {exemption.status !== EXEMPTION_STATUS.CANCELLED &&
                                      (submittingId === exemption.id ? (
                                        <CircularProgress size={24} />
                                      ) : (
                                        <PrimaryButton
                                          variant="outlined"
                                          onClick={() => onTransitionClicked(exemption, 'cancel')}
                                        >
                                          <MuiIcon name="x" />
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
}

export default ExemptionDropdownList;
