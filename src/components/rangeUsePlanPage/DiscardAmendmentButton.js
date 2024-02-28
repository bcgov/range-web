import React, { useState } from 'react';
import { Button, Icon, Confirm } from 'semantic-ui-react';
import { DISCARD_AMENDMENT } from '../../constants/strings';
import { useCurrentPlan } from '../../providers/PlanProvider';
import { useNetworkStatus } from '../../utils/hooks/network';
import { discardAmendment } from '../../api';
import { useToast } from '../../providers/ToastProvider';

const DiscardAmendmentButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDiscarding, setDiscarding] = useState(false);
  const { errorToast } = useToast();

  const { currentPlan, fetchPlan } = useCurrentPlan();

  const isOnline = useNetworkStatus();

  const handleDiscard = async () => {
    setDiscarding(true);

    try {
      await discardAmendment(currentPlan.id);
      await fetchPlan();
    } catch (e) {
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
      <Button
        key="amendBtn"
        inverted
        compact
        type="button"
        disabled={!isOnline}
        onClick={() => {
          openModal();
        }}
      >
        <Icon name="trash" />
        {DISCARD_AMENDMENT}
      </Button>
      <Confirm
        open={isModalOpen}
        onConfirm={handleDiscard}
        onCancel={closeModal}
        header="Discard this amendment?"
        content="If you discard this amendment, the RUP will be reverted to the most recently approved version and all changes will be lost."
        confirmButton={<Button loading={isDiscarding}>Discard</Button>}
      />
    </>
  );
};

export default DiscardAmendmentButton;
