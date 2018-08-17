import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { NO_RUP_PROVIDED, REVIEW_REQUIRED, IN_REVIEW, SENT_FOR_INPUT, INPUT_REQUIRED, IN_PROGRESS, REVISIONS_REQUESTED, DRAFT } from '../../constants/strings';
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

  switch (status.code) {
    case PLAN_STATUS.CREATED:
      if (isUserAgreementHolder(user)) {
        statusName = INPUT_REQUIRED;
      } else {
        statusName = SENT_FOR_INPUT;
      }
      modifier += '--orange'; // orange
      break;
    case PLAN_STATUS.DRAFT:
      if (isUserAgreementHolder(user)) {
        statusName = DRAFT;
      } else {
        statusName = IN_PROGRESS;
      }
      modifier += '--gray'; // gray
      break;
    case PLAN_STATUS.STAFF_DRAFT:
      statusName = 'Staff Draft';
      modifier += '--gray'; // gray
      break;
    case PLAN_STATUS.PENDING:
      if (isUserAgreementHolder(user)) {
        statusName = IN_REVIEW;
      } else {
        statusName = REVIEW_REQUIRED;
      }
      modifier += '--purple'; // purple
      break;
    case PLAN_STATUS.CHANGE_REQUESTED:
      statusName = REVISIONS_REQUESTED;
      modifier += '--red'; // red
      break;
    case PLAN_STATUS.COMPLETED:
      statusName = status.name;
      modifier += '--green'; // green
      break;

    // Amendment Statuses
    case PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT:
      statusName = status.name;
      modifier += '--red';
      break;
    case PLAN_STATUS.STANDS_WRONGLY_MADE:
      statusName = status.name;
      modifier += '--green';
      break;
    case PLAN_STATUS.STANDS:
      statusName = status.name;
      modifier += '--green';
      break;
    case PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED:
      statusName = status.name;
      modifier += '--orange';
      break;
    case PLAN_STATUS.NOT_APPROVED:
      statusName = status.name;
      modifier += '--red';
      break;
    case PLAN_STATUS.APPROVED:
      statusName = status.name;
      modifier += '--green';
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
