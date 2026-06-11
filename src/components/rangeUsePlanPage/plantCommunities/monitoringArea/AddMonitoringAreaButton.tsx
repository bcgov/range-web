import React from 'react';
import { Button } from 'semantic-ui-react';

interface AddMonitoringAreaButtonProps {
  onClick: () => void;
}

const AddMonitoringAreaButton: React.FC<AddMonitoringAreaButtonProps> = ({ onClick }) => {
  return (
    <>
      <Button onClick={onClick} primary type="button" className="icon labeled rup__plant-communities__add-button">
        <i className="add circle icon" />
        Add Monitoring Area
      </Button>
    </>
  );
};

export default AddMonitoringAreaButton;
