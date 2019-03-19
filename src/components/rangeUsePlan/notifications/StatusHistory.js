import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { Status } from '../../common';
import { getUserFullName, formatDateToNow } from '../../../utils';
import { REFERENCE_KEY } from '../../../constants/variables';

class StatusHistory extends Component {
  static propTypes = {
    planStatusHistory: PropTypes.arrayOf(PropTypes.number).isRequired,
    planStatusHistoryMap: PropTypes.shape({}).isRequired,
    user: PropTypes.shape({}).isRequired,
    references: PropTypes.shape({}).isRequired,
  };

  render() {
    const { planStatusHistory, planStatusHistoryMap, references, user } = this.props;
    const planStatuses = references[REFERENCE_KEY.PLAN_STATUS];

    return (
      <div className="rup__history">
        {planStatusHistory.map((pshId) => {
          const record = planStatusHistoryMap[pshId];
          const { id, user: recorder, createdAt, fromPlanStatusId, toPlanStatusId } = record || {};
          const from = planStatuses.find(s => s.id === fromPlanStatusId);
          const to = planStatuses.find(s => s.id === toPlanStatusId);

          return (
            <div key={id} className="rup__history__record">
              <div className="rup__history__record__header">
                <Icon name="user circle" />
                {getUserFullName(recorder)}
                <div className="rup__history__record__timestamp">
                  {formatDateToNow(createdAt)}
                </div>
              </div>
              <div className="rup__history__record__statuses">
                <Status status={from} user={user} />
                <Icon name="long arrow alternate right" size="large" />
                <Status status={to} user={user} />
              </div>
              {record.note}
            </div>
          );
        })}
      </div>
    );
  }
}

export default StatusHistory;
