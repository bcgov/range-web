import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal, Icon, Button } from 'semantic-ui-react';
import { closeConfirmationModal } from '../actions';
import { getConfirmationModalsMap } from '../reducers/rootReducer';
import { getObjValues } from '../utils';

const propTypes = {
  confirmationModalsMap: PropTypes.shape({}).isRequired,
  closeConfirmationModal: PropTypes.func.isRequired,
};

class ConfirmationModals extends Component {
  closeConfirmationModal = modal => () => {
    this.props.closeConfirmationModal({
      modalId: modal.id,
    });
  }

  renderConfirmationModal = (modal) => {
    const {
      id,
      header,
      content,
      onYesBtnClicked,
    } = modal;

    return (
      <Modal
        key={id}
        dimmer="blurring"
        size="tiny"
        open
        onClose={this.closeConfirmationModal(modal)}
        closeIcon={<Icon name="close" color="black" />}
      >
        <Modal.Header as="h2" content={header} />
        <Modal.Content>
          <div className="confirmation-modal__content">{content}</div>
          <div className="confirmation-modal__btns">
            <Button
              color="red"
              inverted
              onClick={this.closeConfirmationModal(modal)}
            >
              <Icon name="remove" />
              No
            </Button>
            <Button
              color="green"
              style={{ marginLeft: '10px' }}
              inverted
              onClick={onYesBtnClicked}
            >
              <Icon name="checkmark" />
              Yes
            </Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  render() {
    const confirmationModals = getObjValues(this.props.confirmationModalsMap);

    return (
      <Fragment>
        {confirmationModals.map(this.renderConfirmationModal)}
      </Fragment>
    );
  }
}


const mapStateToProps = state => ({
  confirmationModalsMap: getConfirmationModalsMap(state),
});
ConfirmationModals.propTypes = propTypes;
export default connect(mapStateToProps, { closeConfirmationModal })(ConfirmationModals);
