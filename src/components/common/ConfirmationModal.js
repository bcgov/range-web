import React from 'react';
import { Header, Button, Modal, Icon } from 'semantic-ui-react';

export const ConfirmationModal = ({ open, header, content, 
  onNoClicked, onYesClicked, loading = false }) => (
  <Modal open={open} basic size='small'>
    <Header as='h2'content={header} />
    <Modal.Content>
      <div className="confirmation-modal__content">{content}</div>
    </Modal.Content>
    <Modal.Actions>
      <Button basic color='red' inverted onClick={onNoClicked}>
        <Icon name='remove' /> 
        No
      </Button>
      <Button loading={loading} color='green' inverted onClick={onYesClicked}>
        <Icon name='checkmark' /> 
        Yes
      </Button>
    </Modal.Actions>
  </Modal>
);