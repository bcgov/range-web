import React, { Component } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import { MuiIcon, PrimaryButton } from '../../common';
import { NUMBER_OF_LIMIT_FOR_NOTE } from '../../../constants/variables';
import { isNoteRequired, findStatusWithCode, isStatusChangedRequested } from '../../../utils';
import { Status } from '../../../types';

interface UpdateStatusModalProps {
  header?: string;
  content?: string;
  statusCode?: string;
  open: boolean;
  onClose: () => void;
  fetchPlan: () => Promise<any>;
  plan: any;
  updateRUPStatus: (...args: any[]) => any;
  references?: any;
}
interface UpdateStatusModalState {
  note: string;
  loading: boolean;
}

class UpdateStatusModal extends Component<UpdateStatusModalProps, UpdateStatusModalState> {
  static defaultProps = { header: '', content: '', statusCode: '' };
  state: UpdateStatusModalState = { note: '', loading: false };
  onNoteChange = (_e: any, { value: note }: any) => {
    if (note.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      this.setState({ note });
    }
  };
  onSubmit = () => {
    this.updateStatus(this.props.statusCode!);
  };
  onClose = () => {
    this.setState({ note: '' });
    this.props.onClose();
  };
  updateStatus = async (statusCode: string) => {
    const { plan, references, updateRUPStatus, fetchPlan } = this.props;
    const { note } = this.state;
    const requireNote = isNoteRequired(statusCode);
    const status = findStatusWithCode(references, statusCode);
    this.setState({ loading: true });
    const body: any = { planId: plan.id, statusId: status!.id };
    if (requireNote && note) {
      body.note = note;
    }
    await updateRUPStatus(body);
    await fetchPlan();
    this.onClose();
    this.setState({ loading: false });
  };
  render() {
    const { note, loading } = this.state;
    const { header, content, onClose, open, statusCode } = this.props;
    const lengthOfNote = note ? `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}` : `0/${NUMBER_OF_LIMIT_FOR_NOTE}`;
    const requireNote = isNoteRequired(statusCode!);
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {header}
          <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }} size="small">
            <MuiIcon name="close" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="rup__update-status-modal__content">{content}</div>
          {requireNote && (
            <div className="rup__update-status-modal__note">
              Add
              {isStatusChangedRequested({ code: statusCode } as Status)
                ? ' explanation of changes requested. This will be visible to the agreement holder'
                : ' Note'}
              &nbsp;({NUMBER_OF_LIMIT_FOR_NOTE} characters).
              <TextField
                placeholder="Add notes here"
                onChange={(e) => this.onNoteChange(e, { value: e.target.value })}
                value={note}
                multiline
                fullWidth
                minRows={3}
              />
              <div className="rup__update-status-modal__note__text-length">{lengthOfNote}</div>
            </div>
          )}
          <div className="rup__update-status-modal__btns">
            <PrimaryButton inverted onClick={onClose}>
              <MuiIcon name="remove" />
              Cancel
            </PrimaryButton>
            <PrimaryButton
              style={{ marginLeft: '15px', marginRight: '0' }}
              onClick={this.onSubmit}
              disabled={requireNote && !note}
              loading={loading}
            >
              <MuiIcon name="checkmark" />
              Confirm
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
}
export default UpdateStatusModal;
