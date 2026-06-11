import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Icon } from 'semantic-ui-react';
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

const NewPlanButton: React.FC<NewPlanButtonProps> = ({ agreement }) => {
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
      <Icon className={classes.icon} name="add" fitted={false} />
    </Button>
  );
};

export default NewPlanButton;
