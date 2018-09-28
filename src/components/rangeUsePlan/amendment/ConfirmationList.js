import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { findConfirmationWithClientId, formatDateFromServer, isClientCurrentUser } from '../../../utils';
import { AWAITING_CONFIRMATION } from '../../../constants/strings';

class ConfirmationList extends Component {
  static propTypes = {
    user: PropTypes.shape({}).isRequired,
    clients: PropTypes.arrayOf(PropTypes.object).isRequired,
    plan: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
  };

  renderConfirmation = (client, confirmation, user) => {
    const { confirmed, updatedAt } = confirmation || {};
    const confirmationDate = confirmed ? formatDateFromServer(updatedAt) : AWAITING_CONFIRMATION;

    return (
      <div key={client.id} className="amendment__confirmation__ah-list">
        <div>
          <Icon name="user outline" />
          <span className={classnames('amendment__confirmation__ah-list__cname', {
            'amendment__confirmation__ah-list__cname--bold': isClientCurrentUser(client, user),
          })}
          >
            {client.name}
          </span>
        </div>
        <div>{confirmationDate}</div>
      </div>
    );
  }

  render() {
    const confirmedList = [
      <div key="confirmed1" className="amendment__confirmation__paragraph-title">
        Agreement holders who have confirmed the submission
      </div>,
      <div key="confirmed2" className="amendment__confirmation__ah-list__columns">
        <span>Name</span>
        <span>Confirmation Date</span>
      </div>,
    ];
    const notConfirmedList = [
      <div key="notConfirmed" className="amendment__confirmation__paragraph-title">
        Agreement holders who have not yet confirmed the submission
      </div>,
    ];
    const allConfimed = [
      <div key="allConfirmed" className="amendment__confirmation__paragraph-title">
        All agreement holders have confirmed this submission. It has now been submitted to Range Staff.
      </div>,
    ];
    const { user, confirmationsMap, plan, clients } = this.props;

    clients.map((client) => {
      const confirmation = findConfirmationWithClientId(client.id, plan.confirmations, confirmationsMap);
      const view = this.renderConfirmation(client, confirmation, user);
      if (confirmation && confirmation.confirmed) {
        return confirmedList.push(view);
      }
      return notConfirmedList.push(view);
    });

    if (notConfirmedList.length === 1) {
      return confirmedList.concat(allConfimed);
    }
    return confirmedList.concat(notConfirmedList);
  }
}

export default ConfirmationList;
