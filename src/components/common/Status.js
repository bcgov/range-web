import React from 'react';
import classNames from 'classnames';
import { PENDING, COMPLETED, SUBMITTED } from '../../constants/variables';

export const Status = ({ status, className = "" }) => {
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
      modifier = '';
      break;
  }

  return (
    <div className={classNames('status', className)}>
      <span className={classNames('status__icon', modifier)}/>
      <span className="status__label">{status}</span>  
    </div>
  );
};