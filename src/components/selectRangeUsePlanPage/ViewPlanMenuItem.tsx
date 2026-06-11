import React from 'react';
import { MenuItem } from '@material-ui/core';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Link } from 'react-router-dom';

interface ViewPlanMenuItemProps {
  planId: any;
  currentPage: any;
  menuText: string;
}

function ViewPlanMenuItem({ planId, currentPage, menuText }: ViewPlanMenuItemProps) {
  return (
    <MenuItem
      variant="outlined"
      component={Link as any}
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
}

export default ViewPlanMenuItem;
