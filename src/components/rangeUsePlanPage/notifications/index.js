import React from 'react';
import PropTypes from 'prop-types';
import StatusHistory from './StatusHistory';
import { isStatusAwaitingConfirmation, isStatusIndicatingStaffFeedbackNeeded, isUserStaff } from '../../../utils';
import AHSignaturesStatusModal from './AHSignaturesStatusModal';
import { useUser } from '../../../providers/UserProvider';

const Notifications = (props) => {
  const { plan, planTypeDescription = '' } = props;
  const user = useUser();

  const { status, planStatusHistory } = plan;

  return (
    <div className="rup__notifications">
      {isUserStaff(user) && isStatusIndicatingStaffFeedbackNeeded(status) && (
        <div className="rup__feedback-notification">
          <div className="rup__feedback-notification__title">
            {`Provide input for ${planTypeDescription} Submission`}
          </div>
          Review the Range Use Plan and provide feedback
        </div>
      )}

      {planStatusHistory.length !== 0 && <StatusHistory planStatusHistory={planStatusHistory} />}

      {isStatusAwaitingConfirmation(status) && <AHSignaturesStatusModal {...props} />}
    </div>
  );
};

Notifications.propTypes = {
  plan: PropTypes.shape({}).isRequired,
  planStatusHistoryMap: PropTypes.shape({}).isRequired,
  planTypeDescription: PropTypes.string,
};

export default Notifications;
