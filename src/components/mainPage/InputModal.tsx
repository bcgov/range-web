import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Form as _Form, Icon, Input } from 'semantic-ui-react';

const Form = _Form as any;
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
    <Modal dimmer="blurring" size="mini" open={inputModal !== null} onClose={handleModalClose} closeIcon>
      <div className="input-modal">
        <div className="input-modal__title">{title}</div>
        <Form>
          <Form.Field>
            <Input value={input} onChange={onInputChanged} onKeyPress={onInputKeyPressed} autoFocus />
          </Form.Field>
        </Form>
        <div className="input-modal__btns">
          <PrimaryButton inverted fluid onClick={handleModalClose}>
            <Icon name="remove" />
            Cancel
          </PrimaryButton>
          <div>
            <PrimaryButton fluid onClick={onSubmitClicked}>
              <Icon name="checkmark" />
              Submit
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default InputModal;
