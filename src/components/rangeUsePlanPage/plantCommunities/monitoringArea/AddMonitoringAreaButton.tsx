import React from 'react';
import { PrimaryButton, MuiIcon } from '../../../common';

interface AddMonitoringAreaButtonProps {
  onClick: () => void;
}

function AddMonitoringAreaButton({ onClick }: AddMonitoringAreaButtonProps) {
  return (
    <PrimaryButton
      onClick={onClick}
      type="button"
      className="icon labeled rup__plant-communities__add-button"
      startIcon={<MuiIcon name="add circle" />}
    >
      Add Monitoring Area
    </PrimaryButton>
  );
}

export default AddMonitoringAreaButton;
