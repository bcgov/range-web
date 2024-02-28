import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Form, TextArea } from 'semantic-ui-react';
import { NUMBER_OF_LIMIT_FOR_NOTE } from '../../../constants/variables';
import {
  isNoteRequired,
  findStatusWithCode,
  isStatusChangedRequested,
} from '../../../utils';
import { PrimaryButton } from '../../common';

class UpdateStatusModal extends Component {
  static propTypes = {
    header: PropTypes.string,
    content: PropTypes.string,
    statusCode: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    fetchPlan: PropTypes.func.isRequired,
    plan: PropTypes.object.isRequired,
    updateRUPStatus: PropTypes.func.isRequired,
    references: PropTypes.object,
  };

  static defaultProps = {
    header: '',
    content: '',
    statusCode: '',
  };

  state = {
    note: '',
    loading: false,
  };

  onNoteChange = (e, { value: note }) => {
    if (note.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      this.setState({ note });
    }
  };

  onSubmit = () => {
    const { statusCode } = this.props;
    this.updateStatus(statusCode);
  };

  onClose = () => {
    this.setState({ note: '' });
    this.props.onClose();
  };

  updateStatus = async (statusCode) => {
    const { plan, references, updateRUPStatus, fetchPlan } = this.props;
    const { note } = this.state;
    const requireNote = isNoteRequired(statusCode);

    const status = findStatusWithCode(references, statusCode);

    this.setState({ loading: true });
    const body = { planId: plan.id, statusId: status.id };
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
    const lengthOfNote = note
      ? `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}`
      : `0/${NUMBER_OF_LIMIT_FOR_NOTE}`;
    const requireNote = isNoteRequired(statusCode);

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={onClose}
        onFocus={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Header as="h2" content={header} />
        <Modal.Content>
          <div className="rup__update-status-modal__content">{content}</div>
          {requireNote && (
            <div className="rup__update-status-modal__note">
              Add
              {isStatusChangedRequested({ code: statusCode })
                ? ' explanation of changes requested. This will be visible to the agreement holder'
                : ' Note'}
              &nbsp;({NUMBER_OF_LIMIT_FOR_NOTE} characters).
              <Form>
                <TextArea
                  placeholder="Add notes here"
                  onChange={this.onNoteChange}
                  value={note}
                />
              </Form>
              <div className="rup__update-status-modal__note__text-length">
                {lengthOfNote}
              </div>
            </div>
          )}
          <div className="rup__update-status-modal__btns">
            <PrimaryButton inverted onClick={onClose}>
              <Icon name="remove" />
              Cancel
            </PrimaryButton>
            <PrimaryButton
              style={{ marginLeft: '15px', marginRight: '0' }}
              onClick={this.onSubmit}
              disabled={requireNote && !note}
              loading={loading}
            >
              <Icon name="checkmark" />
              Confirm
            </PrimaryButton>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default UpdateStatusModal;
