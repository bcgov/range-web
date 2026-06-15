import React, { useState } from 'react';
import { useReferences } from '../../../providers/ReferencesProvider';
import { REFERENCE_KEY } from '../../../constants/variables';
import InputModal from '../../common/InputModal';
import { PrimaryButton, MuiIcon } from '../../common';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

interface AddMinisterIssueActionButtonProps {
  onSubmit: (action: any) => void;
}

function AddMinisterIssueActionButton({ onSubmit }: AddMinisterIssueActionButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);

  const types = (useReferences() as any)[REFERENCE_KEY.MINISTER_ISSUE_ACTION_TYPE] || [];
  const options = types.map((type: any) => ({
    key: type.id,
    value: type.id,
    text: type.name,
    id: type.id,
  }));

  const otherType = types.find((t: any) => t.name === 'Other');

  const onOptionClicked = (ministerIssueActionTypeId: any) => {
    if (otherType && ministerIssueActionTypeId === otherType.id) {
      return setModalOpen(true);
    }

    const ministerIssueAction = types.find((t: any) => t.id === ministerIssueActionTypeId);
    onSubmit(ministerIssueAction);
  };

  return (
    <>
      <PrimaryButton
        onClick={(e: React.MouseEvent<HTMLElement>) => setMenuAnchorEl(e.currentTarget)}
        type="button"
        className="icon labeled"
        startIcon={<MuiIcon name="add circle" />}
      >
        Add Action
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
      <InputModal
        open={isModalOpen}
        onSubmit={(input: string) => {
          setModalOpen(false);
          onSubmit({ ...otherType, other: input });
        }}
        onClose={() => setModalOpen(false)}
        title="Other Name"
      />
    </>
  );
}

export default AddMinisterIssueActionButton;
