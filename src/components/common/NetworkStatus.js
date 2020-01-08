import React from 'react'
import {
  useNetworkStatus,
  usePlanSyncedStatus
} from '../../utils/hooks/network'

const NetworkStatus = ({ planId }) => {
  const online = useNetworkStatus()
  const synced = usePlanSyncedStatus(planId)

  return (
    <div className="status">
      <span
        className={`status__icon status__icon--${online ? 'green' : 'red'}`}
      />
      <span className="status__label">
        {online ? 'Online' : 'Offline'} ({synced ? 'Synced' : 'Not synced'})
      </span>
    </div>
  )
}

export default NetworkStatus
