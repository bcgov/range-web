import React from 'react';
import { PENDING, NOT_APPROVED, APPROVED, SUBMITTED } from '../../constants/variables';

export const Status = ({ status, className = "" }) => {
  let modifier = 'status__icon';
  switch (status) {
    case PENDING:
      modifier += '--pending';      
      break;
    case SUBMITTED:
      modifier += '--submitted';
      break;
    case NOT_APPROVED:
      modifier += '--not-approved';
      break;
    case APPROVED:
      modifier += '--approved';
      break;
    default:
      modifier = '';
      break;
  }

  return (
    <div className={`status ${className}`}>
      <span className={`status__icon ${modifier}`}/>
      <span className="status__label">{status}</span>  
    </div>
  );
};