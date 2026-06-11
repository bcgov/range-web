import React from 'react';
import { MenuItem } from '@material-ui/core';

interface CreateExemptionMenuItemProps {
  onClick: () => void;
}

export default function CreateExemptionMenuItem({ onClick }: CreateExemptionMenuItemProps) {
  return <MenuItem onClick={onClick}>Create Exemption</MenuItem>;
}
