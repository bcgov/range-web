import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NO_RUP_PROVIDED, REVIEW_REQUIRED, IN_REVIEW, SENT_FOR_INPUT, INPUT_REQUIRED, IN_PROGRESS, REVISIONS_REQUESTED } from '../../constants/strings';
import { PENDING, COMPLETED, CREATED, DRAFT, CHANGE_REQUESTED } from '../../constants/variables';
import User from '../../models/User';
import PlanStatus from '../../models/PlanStatus';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  status: PropTypes.shape({
    id: PropTypes.number,
    code: PropTypes.string,
    name: PropTypes.string,
  }),
  className: PropTypes.string,
  style: PropTypes.shape({}),
};

const defaultProps = {
  className: '',
  status: {},
  style: {},
};

const Status = ({
  status: s,
  className,
  style,
  user: u,
}) => {
  let modifier = 'status__icon';
  let statusName = NO_RUP_PROVIDED;
  const user = new User(u);
  const status = new PlanStatus(s);

  switch (status.name) {
    case CREATED:
      if (user.isAgreementHolder) {
        statusName = INPUT_REQUIRED;
      } else {
        statusName = SENT_FOR_INPUT;
      }
      modifier += '--created'; // orange
      break;
    case DRAFT:
      if (user.isAgreementHolder) {
        statusName = DRAFT;
      } else {
        statusName = IN_PROGRESS;
      }
      modifier += '--draft'; // gray
      break;
    case PENDING:
      if (user.isAgreementHolder) {
        statusName = IN_REVIEW;
      } else {
        statusName = REVIEW_REQUIRED;
      }
      modifier += '--pending'; // purple
      break;
    case CHANGE_REQUESTED:
      statusName = REVISIONS_REQUESTED;
      modifier += '--change-requested'; // red
      break;
    case COMPLETED:
      statusName = COMPLETED;
      modifier += '--completed'; // green
      break;
    default:
      modifier += '--not-provided';
      break;
  }
  return (
    <div className={classnames('status', className)} style={style}>
      <span className={classnames('status__icon', modifier)} />
      <span className="status__label">{statusName}</span>
    </div>
  );
};

Status.propTypes = propTypes;
Status.defaultProps = defaultProps;
export default Status;
