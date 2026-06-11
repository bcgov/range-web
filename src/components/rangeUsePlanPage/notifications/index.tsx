import React from 'react';
import StatusHistory from './StatusHistory';
import { isStatusAwaitingConfirmation, isStatusIndicatingStaffFeedbackNeeded, isUserStaff } from '../../../utils';
import AHSignaturesStatusModal from './AHSignaturesStatusModal';
import { useUser } from '../../../providers/UserProvider';

interface NotificationsProps {
  plan: any;
  planTypeDescription?: string;
  [key: string]: any;
}

function Notifications(props: NotificationsProps) {
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

      {isStatusAwaitingConfirmation(status) && <AHSignaturesStatusModal {...props} user={user} />}
    </div>
  );
}

export default Notifications;
