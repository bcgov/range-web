import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DISCARD_AMENDMENT } from '../../constants/strings';
import { useCurrentPlan } from '../../providers/PlanProvider';
import { useNetworkStatus } from '../../utils/hooks/network';
import { discardAmendment } from '../../api';
import { useToast } from '../../providers/ToastProvider';
import { PrimaryButton, MuiIcon } from '../common';

const DiscardAmendmentButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDiscarding, setDiscarding] = useState(false);
  const { errorToast } = useToast();

  const { currentPlan, fetchPlan } = useCurrentPlan()!;
  const plan = currentPlan as any;

  const isOnline = useNetworkStatus();

  const handleDiscard = async () => {
    setDiscarding(true);

    try {
      await discardAmendment(plan.id);
      await fetchPlan();
    } catch (e: any) {
      errorToast(e.message);
    }

    setTimeout(() => {
      setDiscarding(false);
      closeModal();
    }, 1000);
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <>
      <PrimaryButton inverted compact type="button" disabled={!isOnline} onClick={openModal}>
        <MuiIcon name="trash" />
        {DISCARD_AMENDMENT}
      </PrimaryButton>
      <Dialog open={isModalOpen} onClose={closeModal} maxWidth="xs">
        <DialogTitle>Discard this amendment?</DialogTitle>
        <DialogContent>
          If you discard this amendment, the RUP will be reverted to the most recently approved version and all changes
          will be lost.
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleDiscard} disabled={isDiscarding} variant="contained" color="error">
            {isDiscarding ? 'Discarding...' : 'Discard'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DiscardAmendmentButton;
