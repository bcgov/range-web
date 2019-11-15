import { useState, useEffect } from 'react'
import { getPlanFromLocalStorage } from '../../api'

export const useNetworkStatus = () => {
  const [online, setOnline] = useState(navigator.onLine || true)

  const handler = e => {
    if (e.type === 'offline') setOnline(false)
    if (e.type === 'online') setOnline(true)
  }

  useEffect(() => {
    window.addEventListener('online', handler)
    window.addEventListener('offline', handler)

    return () => {
      window.removeEventListener('online', handler)
      window.removeEventListener('offline', handler)
    }
  }, [])

  return online
}

export const usePlanSyncedStatus = planId => {
  const plan = getPlanFromLocalStorage(planId)

  if (plan && plan.synced) return true
  return false
}
