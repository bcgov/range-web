import React from 'react';
import classNames from 'classnames';
import { NO_RUP_PROVIDED } from '../../constants/strings';
import { PENDING, COMPLETED, SUBMITTED } from '../../constants/variables';

export const Status = ({ status = NO_RUP_PROVIDED, className = "" }) => {
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
      <span className={classNames('status__icon', modifier)}/>
      <span className="status__label">{status}</span>  
    </div>
  );
};