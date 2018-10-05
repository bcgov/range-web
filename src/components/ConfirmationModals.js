import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Icon, Button, Form, TextArea } from 'semantic-ui-react';
import { closeConfirmationModal, editConfirmationModal } from '../actions';
import { getConfirmationModalsMap } from '../reducers/rootReducer';
import { getObjValues } from '../utils';
import { NUMBER_OF_LIMIT_FOR_NOTE } from '../constants/variables';

const propTypes = {
  confirmationModalsMap: PropTypes.shape({}).isRequired,
  closeConfirmationModal: PropTypes.func.isRequired,
  editConfirmationModal: PropTypes.func.isRequired,
};

class ConfirmationModals extends Component {
  closeConfirmationModal = modal => () => {
    this.props.closeConfirmationModal({
      modalId: modal.id,
    });
  }

  onModalNoteChange = modal => (e, { value }) => {
    if (value.length <= NUMBER_OF_LIMIT_FOR_NOTE) {
      const updatedModal = { ...modal, note: value };
      this.props.editConfirmationModal({
        modal: updatedModal,
      });
    }
  }

  renderConfirmationModal = (modal) => {
    const {
      id,
      header,
      content,
      onYesBtnClicked,
      requireNote,
      note,
    } = modal;
    const lengthOfNote = note
      ? `${note.length}/${NUMBER_OF_LIMIT_FOR_NOTE}`
      : `0/${NUMBER_OF_LIMIT_FOR_NOTE}`;

    return (
      <Modal
        key={id}
        dimmer="blurring"
        size="tiny"
        open
        onClose={this.closeConfirmationModal(modal)}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Header as="h2" content={header} />
        <Modal.Content>
          <div className="confirmation-modal__content">{content}</div>
          {requireNote &&
            <div className="confirmation-modal__note">
              Add Note ({NUMBER_OF_LIMIT_FOR_NOTE} characters).
              <Form>
                <TextArea placeholder="Add notes here" onChange={this.onModalNoteChange(modal)} value={note} />
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
              onClick={this.closeConfirmationModal(modal)}
            >
              <Icon name="remove" />
              No
            </Button>
            <Button
              color="green"
              style={{ marginLeft: '10px' }}
              inverted
              onClick={onYesBtnClicked}
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

  render() {
    const confirmationModals = getObjValues(this.props.confirmationModalsMap);

    return (
      <Fragment>
        {confirmationModals.map(this.renderConfirmationModal)}
      </Fragment>
    );
  }
}


const mapStateToProps = state => ({
  confirmationModalsMap: getConfirmationModalsMap(state),
});
ConfirmationModals.propTypes = propTypes;
export default connect(mapStateToProps, { closeConfirmationModal, editConfirmationModal })(ConfirmationModals);
