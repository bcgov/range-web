import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewPlan } from '../../api';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { MenuItem } from '@material-ui/core';

const NewPlanMenuItem = ({ agreement }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.stopPropagation();
    const plan = createNewPlan(agreement);
    navigate(`${RANGE_USE_PLAN}/${plan.id}`);
  };

  return <MenuItem onClick={handleClick}>New plan</MenuItem>;
};

export default NewPlanMenuItem;
