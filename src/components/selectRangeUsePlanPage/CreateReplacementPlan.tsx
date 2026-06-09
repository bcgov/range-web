// @ts-nocheck
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { MenuItem } from '@material-ui/core';
import { createReplacementPlan } from '../../api';
import { RANGE_USE_PLAN } from '../../constants/routes';

const CreateReplacementPlan = ({ planId }) => {
  const navigate = useNavigate();
  return (
    <MenuItem
      onClick={async (e) => {
        e.stopPropagation();
        const replacementPlan = await createReplacementPlan(planId);
        navigate(`${RANGE_USE_PLAN}/${replacementPlan.id}`);
      }}
    >
      Create Replacement Plan
    </MenuItem>
  );
};

export default CreateReplacementPlan;
