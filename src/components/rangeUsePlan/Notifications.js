import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Icon, Modal, Button } from 'semantic-ui-react';
import { isStatusAwaitingConfirmation, isStatusIndicatingStaffFeedbackNeeded, isUserStaff } from '../../utils';
import AHConfirmationList from './amendment/AHConfirmationList';
import PlanStatusHistory from './StatusHistory';
import { InvertedButton } from '../common';

class Notifications extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
    planStatusHistoryMap: PropTypes.shape({}).isRequired,
    planTypeDescription: PropTypes.string,
  };

  static defaultProps = {
    planTypeDescription: '',
  }

  state = {
    confirmationStatusModalOpen: false,
  }

  openConfirmationStatusModal = () => this.setState({ confirmationStatusModalOpen: true })
  closeConfirmationStatusModal = () => this.setState({ confirmationStatusModalOpen: false })

  render() {
    const { confirmationStatusModalOpen } = this.state;
    const {
      plan,
      confirmationsMap,
      user,
      planTypeDescription,
      references,
      planStatusHistoryMap,
    } = this.props;
    const { confirmations, status, agreement, planStatusHistory } = plan;
    const clients = (agreement && agreement.clients) || [];

    let numberOfConfirmed = 0;
    confirmations.forEach((cId) => {
      if (confirmationsMap[cId] && confirmationsMap[cId].confirmed) {
        numberOfConfirmed += 1;
      }
    });

    return (
      <div className="rup__notifications">
        {isUserStaff(user) && isStatusIndicatingStaffFeedbackNeeded(status) &&
          <div className="rup__feedback-notification">
            <div className="rup__feedback-notification__title">
              {`Provide input for ${planTypeDescription} Submission`}
            </div>
            Review the Range Use Plan and provide for feedback
          </div>
        }

        {planStatusHistory.length !== 0 &&
          <PlanStatusHistory
            planStatusHistory={planStatusHistory}
            planStatusHistoryMap={planStatusHistoryMap}
            user={user}
            references={references}
          />
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
                  <AHConfirmationList
                    user={user}
                    clients={clients}
                    plan={plan}
                    confirmationsMap={confirmationsMap}
                  />
                  <span>
                    This amendment will not be submitted until all agreement holders have confirmed and eSigned.
                  </span>
                  <Button
                    primary
                    onClick={this.closeConfirmationStatusModal}
                  >
                    Close
                  </Button>
                </div>
              </Modal.Content>
            </Modal>
            <div className="rup__confirmations-notification">
              <div className="rup__confirmations-notification__left">
                <Icon name="check square" size="large" style={{ marginRight: '5px' }} />
                {`${numberOfConfirmed}/${confirmations.length}`} Confirmations Received
              </div>
              <InvertedButton
                primaryColor
                compact
                onClick={this.openConfirmationStatusModal}
              >
                View Submission Status
              </InvertedButton>
            </div>
          </Fragment>
        }
      </div>
    );
  }
}

export default Notifications;
