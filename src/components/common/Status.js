import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { NO_RUP_PROVIDED } from '../../constants/strings';
import { PENDING, COMPLETED, SUBMITTED } from '../../constants/variables';

const propTypes = {
  className: PropTypes.string,
  status: PropTypes.string,
};

const defaultProps = {
  className: '',
  status: NO_RUP_PROVIDED,
};

const Status = ({ status, className }) => {
  let modifier = 'status__icon';
  switch (status) {
    case PENDING:
      modifier += '--pending';
      break;
    case SUBMITTED:
      modifier += '--submitted';
      break;
    case COMPLETED:
      modifier += '--completed';
      break;
    default:
      modifier += '--not-provided';
      break;
  }

  return (
    <div className={classNames('status', className)}>
      <span className={classNames('status__icon', modifier)} />
      <span className="status__label">{status}</span>
    </div>
  );
};

Status.propTypes = propTypes;
Status.defaultProps = defaultProps;
export default Status;
