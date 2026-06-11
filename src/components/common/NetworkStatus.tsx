import React from 'react';
import { useNetworkStatus, usePlanSyncedStatus } from '../../utils/hooks/network';

interface NetworkStatusProps {
  planId: string | number;
}

function NetworkStatus({ planId }: NetworkStatusProps) {
  const online = useNetworkStatus();
  const synced = usePlanSyncedStatus(planId);

  return (
    <div className="status">
      <span className={`status__icon status__icon--${online ? 'green' : 'red'}`} />
      <span className="status__label">
        {online ? 'Online' : 'Offline'} ({synced ? 'Synced' : 'Not synced'})
      </span>
    </div>
  );
}

export default NetworkStatus;
