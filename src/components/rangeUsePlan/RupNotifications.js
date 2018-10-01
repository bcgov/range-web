import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { isStatusAwaitingConfirmation, isStatusIndicatingStaffFeedbackNeeded } from '../../utils';
import ConfirmationList from './amendment/ConfirmationList';

class RupNotifications extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}),
    planTypeDescription: PropTypes.string,
  };

  static defaultProps = {
    confirmationsMap: {},
    planTypeDescription: '',
  }

  state = {
    confirmationStatusModalOpen: false,
  }

  openConfirmationStatusModal = () => this.setState({ confirmationStatusModalOpen: true })
  closeConfirmationStatusModal = () => this.setState({ confirmationStatusModalOpen: false })

  render() {
    const { confirmationStatusModalOpen } = this.state;
    const { plan, confirmationsMap, user, planTypeDescription } = this.props;
    const { confirmations, status, agreement } = plan;
    const clients = (agreement && agreement.clients) || [];

    let numberOfConfirmed = 0;
    confirmations.forEach((cId) => {
      if (confirmationsMap[cId] && confirmationsMap[cId].confirmed) {
        numberOfConfirmed += 1;
      }
    });

    return (
      <div className="rup__notifications">
        {isStatusIndicatingStaffFeedbackNeeded(status) &&
          <div className="rup__feedback-notification">
            <div className="rup__feedback-notification__title">
              {`Provide input for ${planTypeDescription} Submission`}
            </div>
            Review the Range Use Plan and provide for feedback
          </div>
        }

        {isStatusAwaitingConfirmation(status) &&
          <Fragment>
            <Modal
              dimmer="blurring"
              size="tiny"
              open={confirmationStatusModalOpen}
              onClose={this.closeConfirmationStatusModal}
              closeIcon={<Icon name="close" color="black" />}
            >
              <Modal.Content>
                <div className="rup__confirmations-notification__modal">
                  <Icon name="clock outline" size="huge" />
                  <span className="rup__confirmations-notification__modal__title">
                    Current Submission status
                  </span>
                  <span>
                    There are still agreement holders who have not yet confirmed their confirmation choice.
                  </span>
                  <ConfirmationList
                    user={user}
                    clients={clients}
                    plan={plan}
                    confirmationsMap={confirmationsMap}
                  />
                  <span>
                    This amendment will not be submitted until all agreement holders have confirmed and eSigned.
                  </span>
                  <Button onClick={this.closeConfirmationStatusModal}>Close</Button>
                </div>
              </Modal.Content>
            </Modal>
            <div className="rup__confirmations-notification">
              <div className="rup__confirmations-notification__left">
                <Icon name="check square" size="large" style={{ marginRight: '5px' }} />
                {`${numberOfConfirmed}/${confirmations.length}`} Confirmations Received
              </div>
              <Button onClick={this.openConfirmationStatusModal}>
                View Submission Status
              </Button>
            </div>
          </Fragment>
        }
      </div>
    );
  }
}

export default RupNotifications;
