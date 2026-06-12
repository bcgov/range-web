import React from 'react';
import { useNetworkStatus } from '../../utils/hooks/network';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { AMEND_PLAN_CONFIRM_HEADER, AMEND_PLAN_CONFIRM_CONTENT } from '../../constants/strings';
import { amendFromLegal } from '../../api';
import { useCurrentPlan } from '../../providers/PlanProvider';
import { useReferences } from '../../providers/ReferencesProvider';
import { useUser } from '../../providers/UserProvider';
import { isUserStaff } from '../../utils';
import { useToast } from '../../providers/ToastProvider';
import { PrimaryButton, MuiIcon } from '../common';

const AmendFromLegalButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const references = useReferences();
  const user = useUser();
  const isOnline = useNetworkStatus();
  const { currentPlan, fetchPlan } = useCurrentPlan()!;

  const { errorToast } = useToast();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleAmend = async () => {
    setIsCreating(true);
    try {
      await amendFromLegal(currentPlan, references, isUserStaff(user));
      await fetchPlan();
    } catch (e: any) {
      errorToast(e.message);
      console.error('Error creating amendment:', e.message);
      throw e;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <PrimaryButton inverted compact type="button" disabled={!isOnline || isCreating} onClick={openModal}>
        {isCreating ? null : <MuiIcon name="edit" />}
        {isCreating ? 'Creating...' : 'Amend from Legal'}
      </PrimaryButton>
      <Dialog open={isOpen} onClose={closeModal} maxWidth="xs">
        <DialogTitle>{AMEND_PLAN_CONFIRM_HEADER}</DialogTitle>
        <DialogContent>{AMEND_PLAN_CONFIRM_CONTENT}</DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>Cancel</Button>
          <Button onClick={handleAmend} disabled={isCreating} variant="contained">
            {isCreating ? 'Amending...' : 'Amend from Legal Version'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AmendFromLegalButton;
