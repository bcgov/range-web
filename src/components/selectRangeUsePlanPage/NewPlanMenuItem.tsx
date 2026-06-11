import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewPlan } from '../../api';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { MenuItem } from '@material-ui/core';

interface NewPlanMenuItemProps {
  agreement: any;
}

const NewPlanMenuItem: React.FC<NewPlanMenuItemProps> = ({ agreement }) => {
  const navigate = useNavigate();

  const handleClick = (e: any) => {
    e.stopPropagation();
    const plan = createNewPlan(agreement);
    navigate(`${RANGE_USE_PLAN}/${plan.id}`);
  };

  return <MenuItem onClick={handleClick}>New plan</MenuItem>;
};

export default NewPlanMenuItem;
