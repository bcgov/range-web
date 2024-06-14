import React from 'react';
import { MenuItem } from '@material-ui/core';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Link } from 'react-router-dom';

const ViewPlanMenuItem = ({ planId, currentPage, menuText }) => {
  return (
    <MenuItem
      variant="outlined"
      component={Link}
      to={{
        pathname: `${RANGE_USE_PLAN}/${planId}`,
        state: {
          page: currentPage,
          prevSearch: location.search,
        },
      }}
    >
      {menuText}
    </MenuItem>
  );
};

export default ViewPlanMenuItem;
