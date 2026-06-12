import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import AHConfirmationList from '../pageForAH/confirmationTabs/AHConfirmationList';
import { PrimaryButton, MuiIcon } from '../../common';

interface AHSignaturesStatusModalProps {
  plan: any;
  user: any;
  clientAgreements?: any;
}

function AHSignaturesStatusModal({ plan, user, clientAgreements }: AHSignaturesStatusModalProps) {
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
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="xs" fullWidth>
        <IconButton onClick={closeModal} sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
          <Close />
        </IconButton>
        <DialogContent>
          <div className="rup__signatures-notification__modal">
            <MuiIcon name="clock outline" size="huge" />
            <span className="rup__signatures-notification__modal__title">Current Submission status</span>
            <span>There are still agreement holders who have not yet confirmed their confirmation choice.</span>
            <AHConfirmationList user={user} clients={clients} plan={plan} clientAgreements={clientAgreements} />
            <span>This amendment will not be submitted until all agreement holders have confirmed and eSigned.</span>
            <PrimaryButton onClick={closeModal} style={{ marginTop: '15px' }} content="Close" />
          </div>
        </DialogContent>
      </Dialog>
      <div className="rup__signatures-notification">
        <div className="rup__signatures-notification__left">
          <MuiIcon name="check square" size="large" style={{ marginRight: '5px' }} />
          {`${numberOfConfirmed}/${confirmations.length}`} Confirmations Received
        </div>
        <PrimaryButton inverted compact onClick={openModal}>
          View Submission Status
        </PrimaryButton>
      </div>
    </>
  );
}

export default AHSignaturesStatusModal;
