import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import MuiIcon from '../common/MuiIcon';
import { closeConfirmationModal } from '../../actions';
import { getConfirmationModalsMap } from '../../reducers/rootReducer';
import { getObjValues } from '../../utils';
import { PrimaryButton } from '../common';
import { RootState } from '../../configureStore';

function ConfirmModals() {
  const dispatch = useDispatch();
  const confirmationModalsMap = useSelector((state: RootState) => getConfirmationModalsMap(state));

  const renderConfirmationModal = (modal: any) => {
    const { id: modalId, header, content, onYesBtnClicked: oYBClicked, closeAfterYesBtnClicked } = modal;
    let onYesBtnClicked = oYBClicked;
    if (closeAfterYesBtnClicked) {
      onYesBtnClicked = () => {
        dispatch(closeConfirmationModal({ modalId }));
        oYBClicked();
      };
    }

    return (
      <Dialog key={modalId} open onClose={() => dispatch(closeConfirmationModal({ modalId }))} maxWidth="xs">
        <DialogTitle>
          {header}
          <IconButton
            aria-label="close"
            onClick={() => dispatch(closeConfirmationModal({ modalId }))}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <MuiIcon name="close" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="confirmation-modal__content">{content}</div>
          <div className="confirmation-modal__btns">
            <PrimaryButton inverted onClick={() => dispatch(closeConfirmationModal({ modalId }))}>
              <MuiIcon name="remove" />
              Cancel
            </PrimaryButton>
            <PrimaryButton style={{ marginLeft: '15px' }} onClick={onYesBtnClicked}>
              <MuiIcon name="checkmark" />
              Confirm
            </PrimaryButton>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  const confirmationModals = getObjValues(confirmationModalsMap);

  return <>{confirmationModals.map(renderConfirmationModal)}</>;
}

export default ConfirmModals;
