import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NO_RUP_PROVIDED, REVIEW_REQUIRED, IN_REVIEW, SENT_FOR_INPUT, INPUT_REQUIRED, IN_PROGRESS } from '../../constants/strings';
import { PENDING, COMPLETED, CREATED, DRAFT, CHANGE_REQUESTED } from '../../constants/variables';
import { isUserAdmin, isUserAgreementHolder } from '../../handlers';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  className: PropTypes.string,
  status: PropTypes.string,
  style: PropTypes.shape({}),
};

const defaultProps = {
  className: '',
  status: NO_RUP_PROVIDED,
  style: {},
};

const Status = ({
  status,
  className,
  style,
  user,
}) => {
  let modifier = 'status__icon';
  let statusName = '';
  switch (status) {
    case CREATED:
      if (isUserAdmin(user)) {
        statusName = SENT_FOR_INPUT;
      } else if (isUserAgreementHolder(user)) {
        statusName = INPUT_REQUIRED;
      }
      modifier += '--created'; // orange
      break;
    case DRAFT:
      if (isUserAdmin(user)) {
        statusName = IN_PROGRESS;
      } else if (isUserAgreementHolder(user)) {
        statusName = status;
      }
      modifier += '--draft'; // orange
      break;
    case PENDING:
      if (isUserAdmin(user)) {
        statusName = IN_REVIEW;
      } else if (isUserAgreementHolder(user)) {
        statusName = REVIEW_REQUIRED;
      }
      modifier += '--pending'; // red
      break;
    case CHANGE_REQUESTED:
      statusName = status;
      modifier += '--change-requested'; // orange
      break;
    case COMPLETED:
      statusName = status;
      modifier += '--completed'; // green
      break;
    default:
      statusName = status;
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
