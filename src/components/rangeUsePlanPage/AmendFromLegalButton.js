import React from 'react';
import { useNetworkStatus } from '../../utils/hooks/network';
import { Button, Confirm, Icon } from 'semantic-ui-react';
import { AMEND_PLAN_CONFIRM_HEADER, AMEND_PLAN_CONFIRM_CONTENT } from '../../constants/strings';
import { amendFromLegal } from '../../api';
import { useCurrentPlan } from '../../providers/PlanProvider';
import { useReferences } from '../../providers/ReferencesProvider';
import { useUser } from '../../providers/UserProvider';
import { isUserStaff } from '../../utils';
import { useToast } from '../../providers/ToastProvider';

const AmendFromLegalButton = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const references = useReferences();
  const user = useUser();
  const isOnline = useNetworkStatus();
  const { currentPlan, fetchPlan } = useCurrentPlan();

  const { errorToast } = useToast();

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleAmend = async () => {
    setIsCreating(true);
    try {
      await amendFromLegal(currentPlan, references, isUserStaff(user));
      await fetchPlan();
    } catch (e) {
      errorToast(e.message);
      console.error('Error creating amendment:', e.message);
      throw e;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Button
        key="amendFromLegalBtn"
        inverted
        compact
        type="button"
        loading={isCreating}
        disabled={!isOnline}
        onClick={openModal}
      >
        <Icon name="edit" />
        Amend from Legal
      </Button>
      <Confirm
        open={isOpen}
        onConfirm={handleAmend}
        onCancel={closeModal}
        header={AMEND_PLAN_CONFIRM_HEADER}
        content={AMEND_PLAN_CONFIRM_CONTENT}
        confirmButton={<Button loading={isCreating}>Amend from Legal Version</Button>}
      />
    </>
  );
};

export default AmendFromLegalButton;
