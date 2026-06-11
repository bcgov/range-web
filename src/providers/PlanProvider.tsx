import React, { useContext, useState, useEffect } from 'react';
import { normalize } from 'normalizr';
import * as API from '../api';
import { storePlan } from '../actions';
import * as reduxSchema from '../actionCreators/schema';
import schema from '../components/rangeUsePlanPage/schema';
import { getNetworkStatus } from '../utils/helper/network';
import { useDispatch } from 'react-redux';
import { appendUsage, axios, getAuthHeaderConfig } from '../utils';
import { GET_CLIENT_AGREEMENTS } from '../constants/api';
import uuid from 'uuid-v4';
import { useUser } from './UserProvider';
import type { AppDispatch } from '../configureStore';

interface ClientAgreement {
  [key: string]: unknown;
}

interface PlanContextValue {
  setCurrentPlanId: (id: string | number | null) => void;
  currentPlan: unknown;
  clientAgreements: ClientAgreement[] | null;
  isFetchingPlan: boolean;
  isSavingPlan: boolean;
  errorFetchingPlan: unknown;
  errorSavingPlan: unknown;
  fetchPlan: (id?: string | number | null, hard?: boolean) => Promise<unknown>;
  savePlan: (plan: unknown) => Promise<unknown>;
}

const PlanContext = React.createContext<PlanContextValue | undefined>(undefined);

/**
 * Hook to access the current plan context.
 */
export const useCurrentPlan = (): PlanContextValue | undefined => useContext(PlanContext);

interface PlanProviderProps {
  children: React.ReactNode;
}

export const PlanProvider: React.FC<PlanProviderProps> = ({ children }) => {
  const [currentPlanId, setCurrentPlanId] = useState<string | number | null>(null);
  const [currentPlan, setCurrentPlan] = useState<unknown>(null);
  const [isFetchingPlan, setFetchingPlan] = useState<boolean>(false);
  const [isSavingPlan, setSavingPlan] = useState<boolean>(false);
  const [errorFetchingPlan, setErrorFetchingPlan] = useState<unknown>(null);
  const [errorSavingPlan, setErrorSavingPlan] = useState<unknown>(null);
  const [clientAgreements, setClientAgreements] = useState<ClientAgreement[] | null>(null);

  const user = useUser();
  const dispatch = useDispatch<AppDispatch>();

  const fetchPlan = async (planId: string | number | null = currentPlanId, hard = false): Promise<unknown> => {
    if (planId === null) return;

    setFetchingPlan(true);

    if (errorFetchingPlan) setErrorFetchingPlan(null);
    if (hard) {
      setCurrentPlan(null);
    }

    try {
      const plan = await API.getPlan(planId, user);
      setCurrentPlan(schema.cast(appendUsage(plan)));

      if (!uuid.isUUID(plan.id)) {
        const { data: fetchedClientAgreements } = await axios.get(
          GET_CLIENT_AGREEMENTS(plan.id),
          getAuthHeaderConfig(),
        );
        setClientAgreements(fetchedClientAgreements);
      }

      // TODO: remove redux
      const isOnline = await getNetworkStatus();
      if (isOnline) {
        dispatch(storePlan(normalize(plan, reduxSchema.plan)));
      }

      return plan;
    } catch (e) {
      setErrorFetchingPlan(e);
    } finally {
      setFetchingPlan(false);
    }
  };

  const savePlan = async (plan: unknown): Promise<unknown> => {
    try {
      setSavingPlan(true);
      let planId: unknown;
      try {
        planId = await API.savePlan(plan, user);
        await fetchPlan(planId as string | number | null);
      } catch (e) {
        console.error('Error saving plan:', e);
        throw e;
      }

      return planId;
    } catch (e) {
      setErrorSavingPlan(e);
      throw e;
    } finally {
      setSavingPlan(false);
    }
  };

  useEffect(() => {
    if (currentPlanId !== null) {
      setCurrentPlan(null);
      fetchPlan();
    }
  }, [currentPlanId]);

  return (
    <PlanContext.Provider
      value={{
        setCurrentPlanId,
        currentPlan,
        clientAgreements,
        isFetchingPlan,
        isSavingPlan,
        errorFetchingPlan,
        errorSavingPlan,
        fetchPlan,
        savePlan,
      }}
    >
      {children}
    </PlanContext.Provider>
  );
};

export default PlanProvider;
