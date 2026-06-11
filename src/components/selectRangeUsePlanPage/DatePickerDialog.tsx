import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { Close } from '@material-ui/icons';
import TextField from '@mui/material/TextField';

interface DatePickerDialogProps {
  defaultValue: string;
  title: string;
  inputProps: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedDate: (date: string) => void;
  actionName: string;
  callBack: () => void;
}

export default function DatePickerDialog({
  defaultValue,
  title,
  inputProps,
  open,
  setOpen,
  selectedDate,
  actionName,
  callBack,
}: DatePickerDialogProps) {
  return (
    <Dialog onClose={() => setOpen(false)} aria-labelledby="customized-dialog-title" open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={() => setOpen(false)}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme: any) => theme.palette.grey[500],
        }}
      >
        <Close />
      </IconButton>
      <DialogContent dividers>
        <TextField
          label="Plan End Date"
          type="date"
          inputProps={inputProps}
          defaultValue={defaultValue}
          sx={{ width: 220 }}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event: any) => {
            selectedDate(event.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            setOpen(false);
            callBack();
          }}
        >
          {actionName}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
