import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MuiIcon } from '../common';
import { Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { createNewPlan } from '../../api';
import { RANGE_USE_PLAN } from '../../constants/routes';

const useStyles = makeStyles((theme: any) => ({
  icon: {
    marginLeft: `${theme.spacing()}px !important`,
    height: '100% !important',
  },
}));

interface NewPlanButtonProps {
  agreement: any;
}

function NewPlanButton({ agreement }: NewPlanButtonProps) {
  const navigate = useNavigate();
  const classes = useStyles();

  const handleClick = (e: any) => {
    e.stopPropagation();
    const plan = createNewPlan(agreement);
    navigate(`${RANGE_USE_PLAN}/${plan.id}`);
  };

  return (
    <Button variant="contained" disableElevation color="primary" onClick={handleClick}>
      New plan
      <MuiIcon className={classes.icon} name="add" size="small" />
    </Button>
  );
}

export default NewPlanButton;
