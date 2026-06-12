import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import MuiIcon from '../common/MuiIcon';
import { getInputModal } from '../../reducers/rootReducer';
import { closeInputModal } from '../../actions';
import { PrimaryButton } from '../common';
import { handleWhenEnterPressed } from '../../utils';
import { RootState } from '../../configureStore';

function InputModal() {
  const dispatch = useDispatch();
  const inputModal = useSelector((state: RootState) => getInputModal(state));
  const [input, setInput] = useState((inputModal && (inputModal as any).input) || '');

  const onInputChanged = (e: any) => {
    setInput(e.target.value);
  };

  const handleModalClose = (e: any) => {
    e.preventDefault();
    setInput('');
    dispatch(closeInputModal());
  };

  const onSubmitClicked = (e: any) => {
    const { onSubmit, ...rest } = (inputModal as any) || {};

    if (onSubmit) {
      onSubmit(input, { ...rest });
    }

    handleModalClose(e);
  };

  const onInputKeyPressed = (e: any) => {
    handleWhenEnterPressed(e, onSubmitClicked);
  };

  const title = inputModal && (inputModal as any).title;

  return (
    <Dialog maxWidth="xs" open={inputModal !== null} onClose={handleModalClose}>
      <DialogContent>
        <div className="input-modal">
          <div className="input-modal__title">{title}</div>
          <TextField
            value={input}
            onChange={onInputChanged}
            onKeyPress={onInputKeyPressed}
            autoFocus
            fullWidth
            variant="outlined"
            size="small"
            style={{ marginTop: 16, marginBottom: 16 }}
          />
          <div className="input-modal__btns">
            <PrimaryButton inverted fluid onClick={handleModalClose}>
              <MuiIcon name="remove" />
              Cancel
            </PrimaryButton>
            <div>
              <PrimaryButton fluid onClick={onSubmitClicked}>
                <MuiIcon name="checkmark" />
                Submit
              </PrimaryButton>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default InputModal;
