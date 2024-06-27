import React from 'react';
import { MenuItem } from '@material-ui/core';
import { saveDataInLocalStorage } from '../../utils';

const CopyPlanMenuItem = ({ planId, agreementId, menuText }) => {
  return (
    <MenuItem
      onClick={async (e) => {
        saveDataInLocalStorage('copyPlanInfo', { planId, agreementId });
        e.stopPropagation();
      }}
    >
      {menuText}
    </MenuItem>
  );
};

export default CopyPlanMenuItem;
