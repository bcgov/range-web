import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { MuiIcon } from '../common';
import { DOWNLOAD_PDF } from '../../constants/strings';

interface DownloadPDFBtnProps {
  onClick?: () => void;
  disabled?: boolean;
}

const DownloadPDFBtn = ({ onClick, disabled = false }: DownloadPDFBtnProps) => (
  <MenuItem disabled={disabled} onClick={onClick}>
    <ListItemIcon>
      <MuiIcon name="file pdf outline" />
    </ListItemIcon>
    <ListItemText>{DOWNLOAD_PDF}</ListItemText>
  </MenuItem>
);

export default DownloadPDFBtn;
