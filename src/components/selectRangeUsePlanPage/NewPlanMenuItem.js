import React from 'react';
import { useHistory } from 'react-router-dom';
import { createNewPlan } from '../../api';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { MenuItem } from '@material-ui/core';

const NewPlanMenuItem = ({ agreement }) => {
  const history = useHistory();

  const handleClick = (e) => {
    e.stopPropagation();
    const plan = createNewPlan(agreement);
    history.push(`${RANGE_USE_PLAN}/${plan.id}`);
  };

  return <MenuItem onClick={handleClick}>New plan</MenuItem>;
};

export default NewPlanMenuItem;
