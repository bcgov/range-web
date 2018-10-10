import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon, Button, Form, TextArea } from 'semantic-ui-react';
import { NUMBER_OF_LIMIT_FOR_NOTE, REFERENCE_KEY } from '../../constants/variables';

class UpdateStatusModal extends Component {
  static propTypes = {
    header: PropTypes.string,
    content: PropTypes.string,
    requireNote: PropTypes.bool,
    statusCode: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    planUpdated: PropTypes.func.isRequired,
    addPlanStatusHistoryRecord: PropTypes.func.isRequired,
  }
  static defaultProps = {
    header: '',
    content: '',
    requireNote: false,
    statusCode: '',
  }
  state = {
    note: '',
  }

  onNoteChange = (e, { value: note }) => {
    if (note.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      this.setState({ note });
    }
  }

  onSubmit = () => {
    const { statusCode, requireNote } = this.props;
    this.updateStatus(statusCode, requireNote);
  }

  updateStatus = async (statusCode, requireNote) => {
    const {
      plan,
      references,
      updateRUPStatus,
      planUpdated,
      addPlanStatusHistoryRecord,
      createRUPStatusHistoryRecord,
      onClose,
    } = this.props;
    const { note } = this.state;

    onClose();
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS] || [];
    const status = planStatuses.find(s => s.code === statusCode);
    const { id: planId, planStatusHistory } = plan;

    try {
      const newStatus = await updateRUPStatus(planId, status.id);
      const newPlan = {
        ...plan,
        status: newStatus,
      };
      planUpdated({ plan: newPlan });

      if (requireNote && note) {
        const record = await createRUPStatusHistoryRecord(plan, newStatus, note);
        addPlanStatusHistoryRecord({
          planId,
          record,
          planStatusHistory: [record.id, ...planStatusHistory],
        });
      }
    } catch (err) {
      throw err;
    }
  }

  render() {
    const { note } = this.state;
    const {
      header,
      content,
      requireNote,
      onClose,
      open,
    } = this.props;
    const lengthOfNote = note
      ? `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}`
      : `0/${NUMBER_OF_LIMIT_FOR_NOTE}`;

    return (
      <Modal
        dimmer="blurring"
        size="tiny"
        open={open}
        onClose={onClose}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Header as="h2" content={header} />
        <Modal.Content>
          <div className="confirmation-modal__content">{content}</div>
          {requireNote &&
            <div className="confirmation-modal__note">
              Add Note ({NUMBER_OF_LIMIT_FOR_NOTE} characters).
              <Form>
                <TextArea
                  placeholder="Add notes here"
                  onChange={this.onNoteChange}
                  value={note}
                />
              </Form>
              <div className="confirmation-modal__note__text-length">
                {lengthOfNote}
              </div>
            </div>
          }
          <div className="confirmation-modal__btns">
            <Button
              color="red"
              inverted
              onClick={onClose}
            >
              <Icon name="remove" />
              No
            </Button>
            <Button
              color="green"
              style={{ marginLeft: '10px' }}
              inverted
              onClick={this.onSubmit}
              disabled={requireNote && !note}
            >
              <Icon name="checkmark" />
              Yes
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default UpdateStatusModal;
