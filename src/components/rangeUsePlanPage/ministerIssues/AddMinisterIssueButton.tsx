import React, { useState } from 'react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import { PrimaryButton, MuiIcon } from '../../common';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface AddMinisterIssueButtonProps {
  onSubmit: (ministerIssue: any) => void;
}

function AddMinisterIssueButton({ onSubmit }: AddMinisterIssueButtonProps) {
  const types = (useReferences() as any)[REFERENCE_KEY.MINISTER_ISSUE_TYPE] || [];

  return <MinisterIssuePicker types={types} onSubmit={onSubmit} />;
}

interface MinisterIssuePickerProps {
  types: any[];
  onSubmit: (ministerIssue: any) => void;
}

const MinisterIssuePicker = React.memo<MinisterIssuePickerProps>(({ types, onSubmit }) => {
  const options = types.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id,
  }));

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const onOptionClicked = (ministerIssueTypeId: any) => {
    const ministerIssue = types.find((t: any) => t.id === ministerIssueTypeId);
    onSubmit(ministerIssue);
  };

  return (
    <>
      <PrimaryButton
        onClick={(e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget)}
        type="button"
        className="icon labeled rup__add-button"
        startIcon={<MuiIcon name="add circle" />}
      >
        Add Minister Issue
      </PrimaryButton>
      <Menu anchorEl={menuAnchorEl} open={!!menuAnchorEl} onClose={() => setMenuAnchorEl(null)}>
        {options.map((opt: any) => (
          <MenuItem
            key={opt.key}
            onClick={() => {
              setMenuAnchorEl(null);
              onOptionClicked(opt.value);
            }}
          >
            {opt.text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
});

MinisterIssuePicker.displayName = 'MinisterIssuePicker';
export default AddMinisterIssueButton;
