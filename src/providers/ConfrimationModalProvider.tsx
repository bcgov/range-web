import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import { PrimaryButton } from '../components/common';

interface ConfirmationData {
  titleText?: string;
  contentText?: string;
  cancelText?: string;
  confirmText?: string;
}

interface ConfirmationState extends ConfirmationData {
  isOpen: boolean;
}

type ConfirmFn = (data: ConfirmationData) => Promise<boolean>;

const ConfirmationModal = createContext<ConfirmFn | undefined>(undefined);

export function ConfirmationModalProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [state, setState] = useState<ConfirmationState>({ isOpen: false });
  const fn = useRef<((choice: boolean) => void) | undefined>(undefined);

  const confirm: ConfirmFn = useCallback(
    (data) => {
      return new Promise<boolean>((resolve) => {
        setState({ ...data, isOpen: true });
        fn.current = (choice: boolean) => {
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
        onClose={() => fn.current?.(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{state.titleText || 'Confirm'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{state.contentText}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <PrimaryButton inverted onClick={() => fn.current?.(false)}>
            {state.cancelText || 'Cancel'}
          </PrimaryButton>
          <PrimaryButton onClick={() => fn.current?.(true)} autoFocus>
            {state.confirmText || 'Confirm'}
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </ConfirmationModal.Provider>
  );
}

export default function useConfirm(): ConfirmFn | undefined {
  return useContext(ConfirmationModal);
}
