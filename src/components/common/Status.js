import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NO_RUP_PROVIDED, REVIEW_REQUIRED, IN_REVIEW, SENT_FOR_INPUT, INPUT_REQUIRED, IN_PROGRESS, REVISIONS_REQUESTED } from '../../constants/strings';
import { PLAN_STATUS } from '../../constants/variables';
import { isUserAgreementHolder } from '../../utils';

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
  status,
  className,
  style,
  user,
}) => {
  let modifier = 'status__icon';
  let statusName = NO_RUP_PROVIDED;

  switch (status.name) {
    case PLAN_STATUS.CREATED:
      if (isUserAgreementHolder(user)) {
        statusName = INPUT_REQUIRED;
      } else {
        statusName = SENT_FOR_INPUT;
      }
      modifier += '--created'; // orange
      break;
    case PLAN_STATUS.DRAFT:
      if (isUserAgreementHolder(user)) {
        statusName = PLAN_STATUS.DRAFT;
      } else {
        statusName = IN_PROGRESS;
      }
      modifier += '--draft'; // gray
      break;
    case PLAN_STATUS.PENDING:
      if (isUserAgreementHolder(user)) {
        statusName = IN_REVIEW;
      } else {
        statusName = REVIEW_REQUIRED;
      }
      modifier += '--pending'; // purple
      break;
    case PLAN_STATUS.CHANGE_REQUESTED:
      statusName = REVISIONS_REQUESTED;
      modifier += '--change-requested'; // red
      break;
    case PLAN_STATUS.COMPLETED:
      statusName = PLAN_STATUS.COMPLETED;
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
