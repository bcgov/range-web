import React from 'react';
import { MenuItem } from '@material-ui/core';
import { RANGE_USE_PLAN } from '../../constants/routes';
import { Link } from 'react-router-dom';

interface ViewPlanMenuItemProps {
  planId: any;
  currentPage: any;
  menuText: string;
}

const ViewPlanMenuItem: React.FC<ViewPlanMenuItemProps> = ({ planId, currentPage, menuText }) => {
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
};

export default ViewPlanMenuItem;
