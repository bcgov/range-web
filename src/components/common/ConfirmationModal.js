import React from 'react';
import { Header, Button, Modal, Icon } from 'semantic-ui-react';

export const ConfirmationModal = ({ open, header, content, onNoClicked, onYesClicked }) => (
  <Modal open={open} basic size='small'>
    <Header as='h2'content={header} />
    <Modal.Content>
      <p className="confirmation-modal__content">{content}</p>
    </Modal.Content>
    <Modal.Actions>
      <Button basic color='red' inverted onClick={onNoClicked}>
        <Icon name='remove' /> No
      </Button>
      <Button color='green' inverted onClick={onYesClicked}>
        <Icon name='checkmark' /> Yes
      </Button>
    </Modal.Actions>
  </Modal>
);