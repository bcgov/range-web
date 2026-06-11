import { useState, useEffect } from 'react';
import { getPlanFromLocalStorage } from '../../api';
import { getNetworkStatus } from '../helper/network';

export const useNetworkStatus = (): boolean => {
  const [online, setOnline] = useState<boolean>(navigator.onLine || true);

  const handler = (e: Event): void => {
    if (e.type === 'offline') setOnline(false);
    if (e.type === 'online') setOnline(true);
    checkNetworkStatus();
  };

  const checkNetworkStatus = (): void => {
    getNetworkStatus().then(setOnline);
  };

  useEffect(() => {
    checkNetworkStatus();

    const interval = setInterval(checkNetworkStatus, 10000);

    window.addEventListener('online', handler);
    window.addEventListener('offline', handler);

    return () => {
      clearInterval(interval);

      window.removeEventListener('online', handler);
      window.removeEventListener('offline', handler);
    };
  }, []);

  return online;
};

export const usePlanSyncedStatus = (planId: string | number): boolean => {
  const plan = getPlanFromLocalStorage(planId);

  if (plan && plan.synced) return true;
  return false;
};
