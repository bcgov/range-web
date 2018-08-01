import React from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Modal, Icon } from 'semantic-ui-react';

const propTypes = {
  open: PropTypes.bool.isRequired,
  header: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  onNoClicked: PropTypes.func.isRequired,
  onYesClicked: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

const defaultProps = {
  loading: false,
};

const ConfirmationModal = ({
  open,
  header,
  content,
  onNoClicked,
  onYesClicked,
  loading,
}) => (
  <Modal
    dimmer="blurring"
    size="small"
    open={open}
    onClose={onNoClicked}
  >
    <Header as="h2"content={header} />
    <Modal.Content>
      <div className="confirmation-modal__content">{content}</div>
    </Modal.Content>
    <Modal.Actions>
      <Button color="red" inverted onClick={onNoClicked}>
        <Icon name="remove" />
        No
      </Button>
      <Button loading={loading} color="green" inverted onClick={onYesClicked}>
        <Icon name="checkmark" />
        Yes
      </Button>
    </Modal.Actions>
  </Modal>
);

ConfirmationModal.propTypes = propTypes;
ConfirmationModal.defaultProps = defaultProps;
export default ConfirmationModal;
