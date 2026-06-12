import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MuiIcon from '../../../common/MuiIcon';

interface RowMenuProps {
  onCopy: () => void;
  onDelete: () => void;
}

const RowMenu = ({ onCopy, onDelete }: RowMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)} data-testid="schedule-row-menu">
        <MuiIcon name="ellipsis vertical" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setTimeout(() => onCopy(), 0);
          }}
        >
          Duplicate
        </MenuItem>
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            setTimeout(() => onDelete(), 0);
          }}
        >
          Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default RowMenu;
