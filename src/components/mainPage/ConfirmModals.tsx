import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Icon } from 'semantic-ui-react';
import { closeConfirmationModal } from '../../actions';
import { getConfirmationModalsMap } from '../../reducers/rootReducer';
import { getObjValues } from '../../utils';
import { PrimaryButton } from '../common';
import { RootState } from '../../configureStore';

const ConfirmModals: React.FC = () => {
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
      <Modal
        key={modalId}
        dimmer="blurring"
        size="tiny"
        open
        onClose={() => dispatch(closeConfirmationModal({ modalId }))}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Header as="h2" content={header} />
        <Modal.Content>
          <div className="confirmation-modal__content">{content}</div>
          <div className="confirmation-modal__btns">
            <PrimaryButton inverted onClick={() => dispatch(closeConfirmationModal({ modalId }))}>
              <Icon name="remove" />
              Cancel
            </PrimaryButton>
            <PrimaryButton style={{ marginLeft: '15px' }} onClick={onYesBtnClicked}>
              <Icon name="checkmark" />
              Confirm
            </PrimaryButton>
          </div>
        </Modal.Content>
      </Modal>
    );
  };

  const confirmationModals = getObjValues(confirmationModalsMap);

  return <>{confirmationModals.map(renderConfirmationModal)}</>;
};

export default ConfirmModals;
