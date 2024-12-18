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

export const translateStatusBasedOnUser = (status, user, isForVersionsList = false) => {
  let modifier = 'status__icon';
  let statusName = status.code ? 'Unknown_status' : NO_PLAN;
  switch (status.code) {
    case PLAN_STATUS.DRAFT:
      if (isUserAgreementHolder(user)) {
        statusName = 'Draft in Progress';
      } else {
        statusName = 'AH Draft in Progress';
      }
      modifier += '--gray';
      break;
    case PLAN_STATUS.CREATED:
      if (isUserAgreementHolder(user)) {
        statusName = 'Add Content to RUP';
        modifier += '--orange';
      } else {
        statusName = 'Submitted to AH';
        modifier += '--gray';
      }
      break;
    case PLAN_STATUS.CHANGE_REQUESTED:
      if (isUserAgreementHolder(user)) {
        statusName = 'Make Changes to RUP';
        modifier += '--orange';
      } else {
        statusName = 'Awaiting AH Input';
        modifier += '--gray';
      }
      break;
    case PLAN_STATUS.STAFF_DRAFT:
      statusName = 'Staff Draft';
      modifier += '--gray';
      break;

    case PLAN_STATUS.WRONGLY_MADE_WITHOUT_EFFECT:
      if (isUserAgreementHolder(user)) {
        statusName = 'Not Accepted';
      } else {
        statusName = 'Wrongly Made Without Effect';
      }
      modifier += '--red';
      break;
    case PLAN_STATUS.STANDS_WRONGLY_MADE:
      if (isForVersionsList) {
        statusName = 'Stands';
      } else {
        statusName = 'Wrongly Made Stands';
      }
      modifier += '--green';
      break;
    case PLAN_STATUS.STANDS_REVIEW:
      if (isUserAgrologist(user)) {
        statusName = 'Review Amendment';
        modifier += '--orange';
      } else {
        statusName = 'Stands';
        modifier += '--green';
      }
      break;
    case PLAN_STATUS.STANDS_NOT_REVIEWED:
      if (isForVersionsList) {
        statusName = 'Stands';
        modifier += '--green';
      } else {
        if (isUserAgreementHolder(user)) {
          statusName = 'Stands';
          modifier += '--green';
        } else {
          statusName = 'Stands - Not Reviewed';
          modifier += '--green';
        }
      }
      break;
    case PLAN_STATUS.STANDS:
      statusName = 'Stands';
      modifier += '--green';
      break;

    case PLAN_STATUS.SUBMITTED_FOR_REVIEW:
      if (isUserAgrologist(user)) {
        statusName = 'Provide Feedback';
        modifier += '--orange';
      } else {
        statusName = 'Awaiting Feedback from SA';
        modifier += '--gray';
      }
      break;
    case PLAN_STATUS.SUBMITTED_FOR_FINAL_DECISION:
      if (isUserAgrologist(user)) {
        statusName = 'Decision Required';
        modifier += '--orange';
      } else {
        statusName = 'Awaiting Decision';
        modifier += '--gray';
      }
      break;
    case PLAN_STATUS.AWAITING_CONFIRMATION:
      if (isUserAgreementHolder(user)) {
        statusName = 'Awaiting Signatures';
        modifier += '--orange';
      } else {
        statusName = 'AH Signatures Pending';
        modifier += '--gray';
      }
      break;

    case PLAN_STATUS.RECOMMEND_FOR_SUBMISSION:
      if (isUserAgreementHolder(user)) {
        statusName = 'Ready to Submit';
        modifier += '--orange';
      } else {
        statusName = 'Recommended For Submission';
        modifier += '--gray';
      }
      break;
    case PLAN_STATUS.RECOMMEND_READY:
      if (isUserDecisionMaker(user)) {
        statusName = 'Approval Recommended';
        modifier += '--orange';
      } else {
        statusName = 'Awaiting Decision';
        modifier += '--gray';
      }
      break;
    case PLAN_STATUS.RECOMMEND_NOT_READY:
      if (isUserDecisionMaker(user)) {
        statusName = 'Approval Not Recommended';
        modifier += '--orange';
      } else {
        statusName = 'Awaiting Decision';
        modifier += '--gray';
      }
      break;

    case PLAN_STATUS.NOT_APPROVED_FURTHER_WORK_REQUIRED:
      statusName = 'Changes Requested';
      if (isUserAgreementHolder(user)) {
        modifier += '--orange';
      } else {
        modifier += '--gray';
      }
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
      statusName = 'Amendment Created';
      modifier += isUserAgreementHolder(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.MANDATORY_AMENDMENT_STAFF:
      statusName = 'Mandatory Amendment Created';
      modifier += isUserAgrologist(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.SUBMITTED_AS_MANDATORY:
      statusName = 'Submitted as Mandatory';
      modifier += isUserAgrologist(user) ? '--orange' : '--gray';
      break;
    case PLAN_STATUS.PENDING:
      statusName = 'Pending';
      modifier += '--gray';
      break;
    case PLAN_STATUS.COMPLETED:
      statusName = 'Completed';
      modifier += '--gray';
      break;
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

const Status = ({ status, className, style, user, isAmendment = false, isForVersionsList = false }) => {
  const { modifier, statusName } = translateStatusBasedOnUser(status, user, isForVersionsList);

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
