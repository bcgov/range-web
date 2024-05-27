import { useHistory } from 'react-router-dom';
import React from 'react';
import { MenuItem } from '@material-ui/core';
import { createExtensionPlan } from '../../api';
import { RANGE_USE_PLAN } from '../../constants/routes';

const CreateExtensionPlan = ({ planId }) => {
  const history = useHistory();
  return (
    <MenuItem
      onClick={async (e) => {
        e.stopPropagation();
        const extensionPlan = await createExtensionPlan(planId);
        history.push(`${RANGE_USE_PLAN}/${extensionPlan.id}`);
      }}
    >
      Create Extension Plan
    </MenuItem>
  );
};

export default CreateExtensionPlan;
