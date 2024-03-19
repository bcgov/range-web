import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Icon } from 'semantic-ui-react';
import { PrimaryButton } from '../common';

class PlanExtensionConfirmationModal extends Component {
  static propTypes = {
    header: PropTypes.string,
    content: PropTypes.string,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
  };

  static defaultProps = {
    header: '',
    content: '',
  };

  onClose = () => {
    this.props.onClose();
  };
  onConfirm = () => {
    this.props.onConfirm();
  };

  render() {
    const { header, content, onClose, onConfirm, open } = this.props;

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
          <div className="rup__update-status-modal__btns">
            <PrimaryButton inverted onClick={onClose}>
              <Icon name="remove" />
              Cancel
            </PrimaryButton>
            <PrimaryButton
              style={{ marginLeft: '15px', marginRight: '0' }}
              onClick={onConfirm}
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

export default PlanExtensionConfirmationModal;
