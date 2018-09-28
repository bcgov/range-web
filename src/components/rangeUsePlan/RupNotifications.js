import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Button, Icon } from 'semantic-ui-react';
import { isStatusAwaitingConfirmation } from '../../utils';

class RupNotifications extends Component {
  static propTypes = {
    plan: PropTypes.shape({}).isRequired,
    confirmationsMap: PropTypes.shape({}).isRequired,
  };

  render() {
    const { plan, confirmationsMap } = this.props;
    const { confirmations, status } = plan;
    let numberOfConfirmed = 0;
    confirmations.forEach((cId) => {
      if (confirmationsMap[cId].confirmed) numberOfConfirmed += 1;
    });

    return (
      <Fragment>
        {isStatusAwaitingConfirmation(status) &&
          <div className="rup__confirmations-notification">
            <div className="rup__confirmations-notification__left">
              <Icon name="check square" size="large" style={{ marginRight: '5px' }} />
              {`${numberOfConfirmed}/${confirmations.length}`} Confirmations Received
            </div>
            <Button>View Submission Status</Button>
          </div>
        }
      </Fragment>
    );
  }
}

export default RupNotifications;
