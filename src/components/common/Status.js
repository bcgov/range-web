import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { PLAN_STATUS } from '../../constants/variables';
import { NO_PLAN } from '../../constants/strings';
import { isUserAgreementHolder, isUserAgrologist, isUserDecisionMaker } from '../../utils';

const propTypes = {
  user: PropTypes.shape({}).isRequired,
  status: PropTypes.shape({
    id: PropTypes.number,
    code: PropTypes.string,
    name: PropTypes.string,
  }),
  className: PropTypes.string,
  style: PropTypes.shape({}),
  isAmendment: PropTypes.bool,
  isForVersionsList: PropTypes.bool,
};

const defaultProps = {
  className: '',
  status: {},
  style: {},
};

export const translateStatusBasedOnUser = (status, user) => {
  let modifier = 'status__icon';
  let statusName = status.code ? 'Unknown_status' : NO_PLAN;
  switch (status.code) {
    case PLAN_STATUS.DRAFT:
      statusName = 'Draft in Progress - AH';
      modifier += '--gray';
      break;
    case PLAN_STATUS.CREATED:
      statusName = 'Add Content to RUP - AH';
      modifier += isUserAgreementHolder(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.CHANGE_REQUESTED:
      statusName = 'Awaiting Input - AH';
      modifier += isUserAgreementHolder(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.STAFF_DRAFT:
      statusName = 'Staff Draft - SA';
      modifier += '--gray';
      break;
    case PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT:
      statusName = 'Wrongly Made Without Effect - AH';
      modifier += '--red';
      break;
    case PLAN_STATUS.STANDS_WRONGLY_MADE:
      statusName = 'Wrongly Made Stands';
      modifier += '--green';
      break;
    case PLAN_STATUS.STANDS_REVIEW:
      statusName = 'Stands - Needs Decision - DM';
      modifier += isUserDecisionMaker(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.STANDS_NOT_REVIEWED:
      statusName = 'Stands - Not Reviewed - SA';
      modifier += isUserAgrologist(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.STANDS:
      statusName = 'Stands';
      modifier += '--green';
      break;

    case PLAN_STATUS.SUBMITTED_FOR_REVIEW:
      statusName = 'Awaiting Feedback - SA';
      modifier += isUserAgrologist(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION:
      statusName = 'Awaiting Decision - SA';
      modifier += isUserAgrologist(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.AWAITING_CONFIRMATION:
      statusName = 'Signatures Pending - AH';
      modifier += isUserAgreementHolder(user) ? '--orange' : '--gray';
      break;

    case PLAN_STATUS.RECOMMEND_FOR_SUBMISSION:
      statusName = 'Recommended For Submission - AH';
      modifier += isUserAgreementHolder(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.RECOMMEND_READY:
      statusName = 'Approval Recommended - DM';
      modifier += isUserDecisionMaker(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.RECOMMEND_NOT_READY:
      statusName = 'Approval Not Recommended - DM';
      modifier += isUserDecisionMaker(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED:
      statusName = 'Changes Requested - AH';
      modifier += isUserAgreementHolder(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.NOT_APPROVED:
      statusName = 'Not Approved';
      modifier += '--red';
      break;
    case PLAN_STATUS.APPROVED:
      statusName = 'Approved';
      modifier += '--green';
      break;
    case PLAN_STATUS.AMENDMENT_AH:
      statusName = 'Amendment Created - AH';
      modifier += isUserAgreementHolder(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.MANDATORY_AMENDMENT_STAFF:
      statusName = 'Mandatory Amendment Created - SA';
      modifier += isUserAgrologist(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.SUBMITTED_AS_MANDATORY:
      statusName = 'Submitted as Mandatory - SA';
      modifier += isUserAgrologist(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.PENDING:
      statusName = 'Pending';
      modifier += '--gray';
      break;
    // case PLAN_STATUS.COMPLETED:
    //   statusName = 'Completed';
    //   modifier += '--gray';
    //   break;
    case PLAN_STATUS.READY_FOR_FINAL_DECISION:
      statusName = 'Ready For Final Decision';
      modifier += '--gray';
      break;
    case PLAN_STATUS.RETIRED:
      statusName = 'Retired';
      modifier += '--gray';
      break;
    case PLAN_STATUS.EXPIRED:
      statusName = 'Expired';
      modifier += '--gray';
      break;
    default:
      modifier += '--not-provided';
      break;
  }
  return { modifier, statusName };
};

const Status = ({ status, className, style, user, isAmendment = false }) => {
  const { modifier, statusName } = translateStatusBasedOnUser(status, user);

  return (
    <div className={classnames('status', className)} style={style}>
      <span className={classnames('status__icon', modifier)} />
      <span className="status__label">{statusName}</span>
      {isAmendment && <span className="status__amendment-label">Amendment</span>}
    </div>
  );
};

Status.propTypes = propTypes;
Status.defaultProps = defaultProps;
export default Status;
