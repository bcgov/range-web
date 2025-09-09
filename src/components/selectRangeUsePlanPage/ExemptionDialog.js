import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment';
import { axios, getAuthHeaderConfig } from '../../utils';
import useConfirm from '../../providers/ConfrimationModalProvider';
import { getSignedUploadUrl } from '../../api';
import { downloadAttachment } from '../rangeUsePlanPage/attachments/AttachmentRow';
import { ATTACHMENT_TYPE } from '../../constants/variables';

const useStyles = makeStyles((theme) => ({
  dialogTitle: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.contrastText,
  },
  legalText: {
    marginBottom: theme.spacing(3),
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  fileSection: {
    marginTop: theme.spacing(2),
  },
  note: {
    fontStyle: 'italic',
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  fileAttachmentNote: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  justification: {
    marginTop: theme.spacing(2),
  },
}));

export default function ExemptionDialog({ open, onClose, agreementId, onCreated, exemptionToEdit }) {
  const classes = useStyles();
  const confirm = useConfirm();
  const [form, setForm] = useState({
    startDate: '',
    endDate: '',
    reason: '',
    justificationText: '',
  });
  const [attachments, setAttachments] = useState([]);
  const [existingAttachments, setExistingAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const viewOnly = exemptionToEdit?.viewOnly;

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    return moment(dateString).format('YYYY-MM-DD');
  };

  useEffect(() => {
    if (!open) {
      setForm({
        startDate: '',
        endDate: '',
        reason: '',
        justificationText: '',
      });
      setAttachments([]);
      setExistingAttachments([]);
      setSubmitting(false);
      setError(null);
    } else if (exemptionToEdit) {
      setForm({
        startDate: formatDateForInput(exemptionToEdit.startDate),
        endDate: formatDateForInput(exemptionToEdit.endDate),
        reason: exemptionToEdit.reason || '',
        justificationText: exemptionToEdit.justificationText || '',
      });
      setExistingAttachments(exemptionToEdit.attachments || []);
      setAttachments([]);
    }
  }, [open, exemptionToEdit]);

  const onFieldChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validateDates = () => {
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const now = new Date();
    const maxDate = new Date(start);
    maxDate.setFullYear(maxDate.getFullYear() + 1);

    // Reset hours to start of day for accurate comparison
    now.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    // Only check start date is not in past for new exemptions
    if (!exemptionToEdit && start < now) {
      return 'Start date cannot be in the past';
    }

    if (end <= start) {
      return 'End date must be after start date';
    }

    if (end > maxDate) {
      return 'Exemption period cannot exceed 12 months';
    }

    return null;
  };

  const handleCreate = async () => {
    const choice = await confirm({
      titleText: exemptionToEdit ? 'Resubmit Exemption' : 'Submit Exemption',
      contentText: exemptionToEdit
        ? 'Are you sure you want to resubmit this exemption for approval?'
        : 'Are you sure you want to submit this exemption for approval?',
      confirmText: 'Submit',
    });

    if (!choice) return;

    setSubmitting(true);
    setError(null);

    const dateError = validateDates();
    if (dateError) {
      setError(dateError);
      setSubmitting(false);
      return;
    }

    try {
      const attachmentsMeta = [];

      try {
        for (const f of attachments) {
          const signedUrl = await getSignedUploadUrl(encodeURIComponent(f.name));

          await axios.put(signedUrl, f, {
            headers: {
              'Content-Type': f.type || 'application/octet-stream',
            },
            skipAuthorizationHeader: true,
          });

          attachmentsMeta.push({
            name: encodeURIComponent(f.name),
            url: encodeURIComponent(f.name),
            type: f.type || 'application/octet-stream',
          });
        }
      } catch (err) {
        throw new Error('Failed to upload attachment(s)');
      }

      const body = {
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        justificationText: form.justificationText,
        attachments: attachmentsMeta.length > 0 ? [...existingAttachments, ...attachmentsMeta] : existingAttachments,
      };

      if (exemptionToEdit) {
        const putBody = {
          ...body,
          action: 'submit',
        };
        await axios.put(`/v1/agreement/${agreementId}/exemption/${exemptionToEdit.id}`, putBody, getAuthHeaderConfig());
      } else {
        await axios.post(`/v1/agreement/${agreementId}/exemption`, body, getAuthHeaderConfig());
      }

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canCreate =
    !submitting &&
    form.startDate &&
    form.endDate &&
    form.reason &&
    form.justificationText &&
    (existingAttachments.length > 0 || attachments.length > 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className={classes.dialogTitle}>Range Use Plan Exemption</DialogTitle>
      <DialogContent>
        <Typography variant="body1" className={classes.legalText}>
          Under Section 32 of FRPA, an agreement holder must prepare, submit and obtain the Minister&#39;s approval
          prior to turning out livestock. Under Section 3, RPPR, the Minister may exempt a range agreement holder from
          Section 32, if satisfied that grazing on the agreement area:
        </Typography>
        <Typography component="div" className={classes.legalText}>
          <Box component="span" display="block" ml={4}>
            a) will not endanger the range resource,
          </Box>
          <Box component="span" display="block" ml={4}>
            b) in the public interest, and
          </Box>
          <Box component="span" display="block" ml={4}>
            c) is consistent with Division 2 of the Range Planning and Practices Regulation.
          </Box>
        </Typography>
        <Typography variant="body1" className={classes.legalText}>
          An exemption must specify the time period for which the exemption applies, and, before the expiry, the
          agreement holder must prepare and submit for approval a Range Use Plan (if they have not already) to take
          effect on the expiry of the exemption.
        </Typography>
        <Typography variant="body1" className={classes.legalText}>
          This page will allow you to create the exemption and submit it to the district manager for approval.
        </Typography>

        <div className={classes.section}>
          <FormControl component="fieldset" disabled={viewOnly}>
            <FormLabel component="legend">Reason For Exemption</FormLabel>
            <RadioGroup name="reason" value={form.reason} onChange={onFieldChange}>
              <FormControlLabel
                value="Plan Not Submitted"
                control={<Radio />}
                label="Acceptable plan not submitted by range agreement holder"
              />
              <FormControlLabel
                value="Plan Awaiting Decision"
                control={<Radio />}
                label="Plan submitted by range agreement holder, but a decision has not been made"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className={classes.section}>
          <TextField
            label="Exemption Start Date"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={onFieldChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            disabled={viewOnly}
          />

          <TextField
            label="Exemption End Date"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={onFieldChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
            disabled={viewOnly}
          />
          <Typography className={classes.note}>
            Note: End date should not be for more than one year past the start date.
          </Typography>

          <Box className={classes.section}>
            <TextField
              label="Justification"
              name="justificationText"
              value={form.justificationText}
              onChange={onFieldChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
              className={classes.justification}
              disabled={viewOnly}
            />
          </Box>

          <Typography variant="subtitle1">Attach Draft Plan</Typography>
          <Typography variant="body2" className={classes.fileAttachmentNote}>
            A draft plan or expired plan must be attached to the exemption as a FRPA Section 112 condition of approval.
            This attachment must be adhered to and cannot be amended by the agreement holder as it is not a Range Use
            Plan.
          </Typography>

          {existingAttachments.length > 0 && (
            <Box mt={2} mb={2}>
              <Typography variant="subtitle2">Current Attachments:</Typography>
              {existingAttachments.map((attachment, idx) => (
                <Box key={`${attachment.name}_${idx}`} display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" style={{ flex: 1 }}>
                    {attachment.name}
                  </Typography>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() =>
                      downloadAttachment(attachment.id, attachment.name, ATTACHMENT_TYPE.EXEMPTION_ATTACHMENT)
                    }
                    style={{ marginRight: '10px' }}
                  >
                    Download
                  </Button>
                  {!viewOnly && (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => setExistingAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="*"
            multiple
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || []);
              setAttachments((prev) => {
                const combined = [...prev, ...newFiles];
                const seen = new Set();
                const unique = [];
                combined.forEach((f) => {
                  const key = `${f.name}_${f.size}`;
                  if (!seen.has(key)) {
                    seen.add(key);
                    unique.push(f);
                  }
                });
                return unique;
              });
              e.target.value = null;
            }}
            style={{ display: 'none' }}
          />

          {!viewOnly && (
            <Button variant="outlined" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              Choose File
            </Button>
          )}

          {attachments.length > 0 && (
            <Box mt={1}>
              <Typography variant="subtitle2">New Attachments:</Typography>
              {attachments.map((file, idx) => (
                <Box key={`${file.name}_${file.size}`} display="flex" alignItems="center" mt={1}>
                  <Typography variant="body2" style={{ flex: 1 }}>
                    {file.name}
                  </Typography>
                  {!viewOnly && (
                    <Button
                      size="small"
                      color="secondary"
                      onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </div>

        {error && (
          <Box mt={2}>
            <Typography color="error">{error}</Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Close
        </Button>
        {!viewOnly &&
          (submitting ? (
            <Box display="flex" alignItems="center" gap={1}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Button onClick={handleCreate} color="primary" variant="contained" disabled={!canCreate}>
              Submit for approval
            </Button>
          ))}
      </DialogActions>
    </Dialog>
  );
}
