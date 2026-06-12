import React, { useRef, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Formik, Field } from 'formik';
import MuiIcon from './MuiIcon';

interface InputModalProps {
  open?: boolean;
  onSubmit: (value: string) => void;
  onClose: () => void;
  title?: string;
  placeholder?: string;
}

function InputModal({
  open = false,
  onSubmit,
  onClose,
  title = 'Enter a value',
  placeholder = 'Type a value here...',
}: InputModalProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  return (
    <Formik
      initialValues={{ input: '' }}
      onSubmit={({ input }, { resetForm }) => {
        resetForm();
        onSubmit(input);
      }}
    >
      {({ resetForm, handleSubmit }) => (
        <Dialog maxWidth="xs" open={open} onClose={onClose}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit();
              }}
            >
              <Field
                name="input"
                placeholder={placeholder}
                innerRef={inputRef}
                as={TextField}
                fullWidth
                variant="outlined"
                size="small"
                style={{ marginTop: 8 }}
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                resetForm();
                onClose();
              }}
              type="button"
            >
              <MuiIcon name="remove" />
              Cancel
            </Button>
            <Button type="submit" variant="contained" onClick={() => handleSubmit()}>
              <MuiIcon name="checkmark" />
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Formik>
  );
}

export default InputModal;
