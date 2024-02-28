import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const AddMonitoringAreaButton = ({ onClick }) => {
  return (
    <>
      <Button
        onClick={onClick}
        primary
        type="button"
        className="icon labeled rup__plant-communities__add-button"
      >
        <i className="add circle icon" />
        Add Monitoring Area
      </Button>
    </>
  );
};

AddMonitoringAreaButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default AddMonitoringAreaButton;
