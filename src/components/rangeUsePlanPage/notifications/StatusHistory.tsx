import React from 'react';
import { Icon } from 'semantic-ui-react';
import { Status } from '../../common';
import { getUserFullName, formatDateToNow } from '../../../utils';
import { REFERENCE_KEY } from '../../../constants/variables';
import { useReferences } from '../../../providers/ReferencesProvider';
import { useUser } from '../../../providers/UserProvider';

interface StatusHistoryProps {
  planStatusHistory: any[];
}

function StatusHistory({ planStatusHistory }: StatusHistoryProps) {
  const references = useReferences();
  const user = useUser() as any;
  const planStatuses = (references as any)[REFERENCE_KEY.PLAN_STATUS];

  return (
    <div className="rup__history">
      {planStatusHistory.map(({ id, user: recorder, createdAt, fromPlanStatusId, toPlanStatusId, note }: any) => {
        const from = planStatuses.find((s: any) => s.id === fromPlanStatusId);
        const to = planStatuses.find((s: any) => s.id === toPlanStatusId);

        return (
          <div key={id} className="rup__history__record">
            <div className="rup__history__record__header">
              <Icon name="user circle" />
              {getUserFullName(recorder)}
              <div className="rup__history__record__timestamp">{formatDateToNow(createdAt)}</div>
            </div>
            <div className="rup__history__record__statuses">
              <Status status={from} user={user} />
              <Icon name="long arrow alternate right" size="large" />
              <Status status={to} user={user} />
            </div>
            {note}
          </div>
        );
      })}
    </div>
  );
}

export default React.memo(StatusHistory);
