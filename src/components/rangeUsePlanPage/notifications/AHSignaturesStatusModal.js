import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal } from 'semantic-ui-react';
import AHConfirmationList from '../pageForAH/confirmationTabs/AHConfirmationList';
import { PrimaryButton } from '../../common';

class AHSignaturesStatusModal extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
    planStatusHistoryMap: PropTypes.shape({}).isRequired,
  };

  state = {
    isModalOpen: false,
  }

  openModal = () => this.setState({ isModalOpen: true })
  closeModal = () => this.setState({ isModalOpen: false })

  render() {
    const { isModalOpen } = this.state;
    const {
      plan,
      confirmationsMap,
      user,
    } = this.props;
    const { confirmations, agreement } = plan;
    const clients = (agreement && agreement.clients) || [];

    let numberOfConfirmed = 0;
    confirmations.forEach((cId) => {
      if (confirmationsMap[cId] && confirmationsMap[cId].confirmed) {
        numberOfConfirmed += 1;
      }
    });

    return (
      <Fragment>
        <Modal
          dimmer="blurring"
          size="tiny"
          open={isModalOpen}
          onClose={this.closeModal}
          closeIcon={<Icon name="close" color="black" />}
        >
          <Modal.Content>
            <div className="rup__signatures-notification__modal">
              <Icon name="clock outline" size="huge" />
              <span className="rup__signatures-notification__modal__title">
                Current Submission status
              </span>
              <span>
                There are still agreement holders who have not yet confirmed their confirmation choice.
              </span>
              <AHConfirmationList
                user={user}
                clients={clients}
                plan={plan}
                confirmationsMap={confirmationsMap}
              />
              <span>
                This amendment will not be submitted until all agreement holders have confirmed and eSigned.
              </span>
              <PrimaryButton
                onClick={this.closeModal}
                style={{ marginTop: '15px' }}
                content="Close"
              />
            </div>
          </Modal.Content>
        </Modal>
        <div className="rup__signatures-notification">
          <div className="rup__signatures-notification__left">
            <Icon name="check square" size="large" style={{ marginRight: '5px' }} />
            {`${numberOfConfirmed}/${confirmations.length}`} Confirmations Received
          </div>
          <PrimaryButton
            inverted
            compact
            onClick={this.openModal}
          >
            View Submission Status
          </PrimaryButton>
        </div>
      </Fragment>
    );
  }
}

export default AHSignaturesStatusModal;
