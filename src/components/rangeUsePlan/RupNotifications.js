import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Modal } from 'semantic-ui-react';
import { Status } from '../common';
import { isStatusAwaitingConfirmation, isStatusIndicatingStaffFeedbackNeeded, isUserStaff, getUserFullName, formatDateToNow } from '../../utils';
import AgreementHolderConfirmations from './amendment/AgreementHolderConfirmations';
import { REFERENCE_KEY } from '../../constants/variables';

class RupNotifications extends Component {
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

  renderStatusHistory = (planStatusHistory) => {
    const { planStatusHistoryMap, references, user: appUser } = this.props;
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];

    return (
      <div className="rup__history">
        {planStatusHistory.map((pshId) => {
          const record = planStatusHistoryMap[pshId];
          const { id, user, createdAt, fromPlanStatusId, toPlanStatusId } = record || {};
          const from = planStatuses.find(s => s.id === fromPlanStatusId);
          const to = planStatuses.find(s => s.id === toPlanStatusId);

          return (
            <div key={id} className="rup__history__record">
              <div className="rup__history__record__header">
                <Icon name="user circle" style={{ marginRight: '5px' }} />
                {getUserFullName(user)}
                <div className="rup__history__record__timestamp">
                  {formatDateToNow(createdAt)}
                </div>
              </div>
              <div className="rup__history__record__statuses">
                <Status status={from} user={appUser} />
                <Icon name="long arrow alternate right" size="large" />
                <Status status={to} user={appUser} />
              </div>
              {record.note}
            </div>
          );
        })}
      </div>
    );
  }
  render() {
    const { confirmationStatusModalOpen } = this.state;
    const {
      plan,
      confirmationsMap,
      user,
      planTypeDescription,
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
        {planStatusHistory.length !== 0 &&
          this.renderStatusHistory(planStatusHistory)
        }

        {isUserStaff(user) && isStatusIndicatingStaffFeedbackNeeded(status) &&
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
                  <AgreementHolderConfirmations
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
