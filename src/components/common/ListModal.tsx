import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MuiIcon from './MuiIcon';
import { PrimaryButton } from './index';

interface ListOption {
  key: string | number;
  value: any;
  text: string;
  disabled?: boolean;
}

interface ListModalProps {
  open: boolean;
  onClose: () => void;
  options: ListOption[];
  onOptionClick?: (option: ListOption) => void;
  onSubmit?: (selected: ListOption[]) => void;
  title?: string;
  multiselect?: boolean;
  buttonText?: string;
}

function ListModal({
  open,
  onClose,
  options,
  onOptionClick,
  onSubmit,
  title = 'Select an option',
  multiselect = false,
  buttonText = 'Submit',
}: ListModalProps) {
  const [selected, setSelected] = useState<ListOption[]>([]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ maxHeight: 300, overflowY: 'auto', py: 0 }}>
        {options.map((option) => (
          <ListItem
            key={option.key}
            disabled={option.disabled}
            onClick={() => {
              if (multiselect) {
                if (selected.includes(option)) {
                  setSelected(selected.filter((s) => s.value !== option.value));
                } else {
                  setSelected([...selected, option]);
                }
              }
              if (onOptionClick) onOptionClick(option);
            }}
            sx={{ padding: '1em', cursor: 'pointer' }}
            divider
          >
            <ListItemText primary={option.text} />
            {selected.includes(option) && <MuiIcon name="check circle" color="blue" />}
          </ListItem>
        ))}
      </List>
      {multiselect && (
        <DialogActions>
          <PrimaryButton
            onClick={() => {
              onSubmit?.(selected);
              setSelected([]);
            }}
            disabled={selected.length === 0}
          >
            {buttonText}
          </PrimaryButton>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default ListModal;
