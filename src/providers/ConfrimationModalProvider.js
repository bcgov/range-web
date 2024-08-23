import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { PrimaryButton } from '../components/common';
const ConfirmationModal = createContext();

export function ConfirmationModalProvider({ children }) {
  const [state, setState] = useState({ isOpen: false });
  const fn = useRef();

  const confirm = useCallback(
    (data) => {
      return new Promise((resolve) => {
        setState({ ...data, isOpen: true });
        fn.current = (choice) => {
          resolve(choice);
          setState({ isOpen: false });
        };
      });
    },
    [setState],
  );

  return (
    <ConfirmationModal.Provider value={confirm}>
      {children}
      <Dialog
        open={state.isOpen}
        onClose={() => fn.current(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{state.titleText || 'Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{state.contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <PrimaryButton inverted onClick={() => fn.current(false)}>
            {state.cancelText || 'Cancel'}
          </PrimaryButton>
          <PrimaryButton onClick={() => fn.current(true)} autoFocus>
            {state.confirmText || 'Confirm'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </ConfirmationModal.Provider>
  );
}

export default function useConfirm() {
  return useContext(ConfirmationModal);
}
