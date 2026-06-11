import React, { useState } from 'react';
import { Icon, Modal } from 'semantic-ui-react';
import AHConfirmationList from '../pageForAH/confirmationTabs/AHConfirmationList';
import { PrimaryButton } from '../../common';

interface AHSignaturesStatusModalProps {
  plan: any;
  user: any;
  clientAgreements?: any;
}

const AHSignaturesStatusModal: React.FC<AHSignaturesStatusModalProps> = ({ plan, user, clientAgreements }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const { confirmations, agreement } = plan;
  const clients = (agreement && agreement.clients) || [];

  let numberOfConfirmed = 0;
  confirmations.forEach((confirmation: any) => {
    if (confirmation && confirmation.confirmed) {
      numberOfConfirmed += 1;
    }
  });

  return (
    <>
      <Modal
        dimmer="blurring"
        size="tiny"
        open={isModalOpen}
        onClose={closeModal}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Content>
          <div className="rup__signatures-notification__modal">
            <Icon name="clock outline" size="huge" />
            <span className="rup__signatures-notification__modal__title">Current Submission status</span>
            <span>There are still agreement holders who have not yet confirmed their confirmation choice.</span>
            <AHConfirmationList user={user} clients={clients} plan={plan} clientAgreements={clientAgreements} />
            <span>This amendment will not be submitted until all agreement holders have confirmed and eSigned.</span>
            <PrimaryButton onClick={closeModal} style={{ marginTop: '15px' }} content="Close" />
          </div>
        </Modal.Content>
      </Modal>
      <div className="rup__signatures-notification">
        <div className="rup__signatures-notification__left">
          <Icon name="check square" size="large" style={{ marginRight: '5px' }} />
          {`${numberOfConfirmed}/${confirmations.length}`} Confirmations Received
        </div>
        <PrimaryButton inverted compact onClick={openModal}>
          View Submission Status
        </PrimaryButton>
      </div>
    </>
  );
};

export default AHSignaturesStatusModal;
