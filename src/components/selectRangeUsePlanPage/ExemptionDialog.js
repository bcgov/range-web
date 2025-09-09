import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@material-ui/core';
import { axios, getAuthHeaderConfig } from '../../utils';
import { getSignedUploadUrl } from '../../api';

export default function ExemptionDialog({ open, onClose, agreementId, onCreated }) {
  const [form, setForm] = useState({ startDate: '', endDate: '', reason: '', justificationText: '' });
  const [attachments, setAttachments] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!open) {
      // reset when closed
      setForm({ startDate: '', endDate: '', reason: '', justificationText: '' });
      setAttachments([]);
      setSubmitting(false);
      setError(null);
    }
  }, [open]);

  const onFieldChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async () => {
    setSubmitting(true);
    setError(null);

    try {
      // Upload each file to signed URL and collect attachment metadata
      const attachmentsMeta = [];

      for (const f of attachments) {
        const signedUrl = await getSignedUploadUrl(encodeURIComponent(f.name));

        await axios.put(signedUrl, f, {
          headers: {
            'Content-Type': f.type || 'application/octet-stream',
          },
          // signed URLs generally don't need auth headers
          skipAuthorizationHeader: true,
        });

        attachmentsMeta.push({ name: encodeURIComponent(f.name), url: encodeURIComponent(f.name) });
      }

      const body = {
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
        justificationText: form.justificationText,
        attachments: attachmentsMeta,
      };

      await axios.post(`/v1/agreement/${agreementId}/exemption`, body, getAuthHeaderConfig());

      if (onCreated) onCreated();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const canCreate =
    !submitting && form.startDate && form.endDate && form.reason && form.justificationText && attachments.length > 0;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Exemption</DialogTitle>
      <DialogContent>
        <TextField
          label="Start Date"
          name="startDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.startDate}
          onChange={onFieldChange}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="End Date"
          name="endDate"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={form.endDate}
          onChange={onFieldChange}
          fullWidth
          margin="dense"
          required
        />
        <TextField
          label="Reason"
          name="reason"
          value={form.reason}
          onChange={onFieldChange}
          fullWidth
          margin="dense"
          multiline
          minRows={2}
          required
        />
        <TextField
          label="Justification"
          name="justificationText"
          value={form.justificationText}
          onChange={onFieldChange}
          fullWidth
          margin="dense"
          multiline
          minRows={2}
          required
        />

        {/* Hidden native file input; triggered by the button below to avoid browser 'no file chosen' text */}
        <input
          ref={fileInputRef}
          type="file"
          accept="*"
          multiple
          onChange={(e) => {
            const newFiles = Array.from(e.target.files || []);
            // merge with existing and dedupe by name+size
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
            // clear the input value so same file can be re-selected if removed
            e.target.value = null;
          }}
          style={{ display: 'none' }}
        />

        {/* Button that opens the hidden file input via react ref (no direct DOM lookup) */}
        <Button
          variant="outlined"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          style={{ marginTop: 16 }}
        >
          Choose files
        </Button>
        {attachments.length > 0 && (
          <ul style={{ marginTop: 8, paddingLeft: 0 }}>
            {attachments.map((file, idx) => (
              <li key={`${file.name}_${file.size}`} style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ flex: 1 }}>{file.name}</span>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => setAttachments((prev) => prev.filter((_, i) => i !== idx))}
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}

        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>
          Cancel
        </Button>
        <Button onClick={handleCreate} color="primary" disabled={!canCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
