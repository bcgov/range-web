import React from 'react';
import { MenuItem } from '@material-ui/core';
import { saveDataInLocalStorage } from '../../utils';

interface CopyPlanMenuItemProps {
  planId: any;
  agreementId: any;
  menuText: string;
  handleClose: (e: any) => void;
}

function CopyPlanMenuItem({ planId, agreementId, menuText, handleClose }: CopyPlanMenuItemProps) {
  return (
    <MenuItem
      onClick={async (e: any) => {
        saveDataInLocalStorage('copyPlanInfo', { planId, agreementId });
        e.stopPropagation();
        handleClose(e);
      }}
    >
      {menuText}
    </MenuItem>
  );
}

export default CopyPlanMenuItem;
