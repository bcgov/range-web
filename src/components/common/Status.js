import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NO_RUP_PROVIDED, REVIEW_REQUIRED, IN_REVIEW, SENT_FOR_INPUT, INPUT_REQUIRED, IN_PROGRESS, NOT_PROVIDED } from '../../constants/strings';
import { PENDING, COMPLETED, CREATED, DRAFT, CHANGE_REQUESTED } from '../../constants/variables';
import { isUserAdmin, isUserAgreementHolder, isUserRangeOfficer } from '../../handlers';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  status: PropTypes.shape({}),
  className: PropTypes.string,
  style: PropTypes.shape({}),
};

const defaultProps = {
  className: '',
  status: {},
  style: {},
};

const Status = ({
  status,
  className,
  style,
  user,
}) => {
  let modifier = 'status__icon';
  let statusName = NO_RUP_PROVIDED;
  switch (status && status.name) {
    case CREATED:
      if (isUserAdmin(user) || isUserRangeOfficer(user)) {
        statusName = SENT_FOR_INPUT;
      } else if (isUserAgreementHolder(user)) {
        statusName = INPUT_REQUIRED;
      }
      modifier += '--created'; // orange
      break;
    case DRAFT:
      if (isUserAdmin(user) || isUserRangeOfficer(user)) {
        statusName = IN_PROGRESS;
      } else if (isUserAgreementHolder(user)) {
        statusName = status.name;
      }
      modifier += '--draft'; // orange
      break;
    case PENDING:
      if (isUserAdmin(user) || isUserRangeOfficer(user)) {
        statusName = IN_REVIEW;
      } else if (isUserAgreementHolder(user)) {
        statusName = REVIEW_REQUIRED;
      }
      modifier += '--pending'; // red
      break;
    case CHANGE_REQUESTED:
      statusName = status.name;
      modifier += '--change-requested'; // orange
      break;
    case COMPLETED:
      statusName = status.name;
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
