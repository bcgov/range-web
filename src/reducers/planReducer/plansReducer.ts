import {
  STORE_PLAN,
  PLAN_UPDATED,
  SCHEDULE_ADDED,
  SCHEDULE_DELETED,
  PLAN_STATUS_HISTORY_RECORD_ADDED,
  MANAGEMENT_CONSIDERATION_ADDED,
  MANAGEMENT_CONSIDERATION_DELETED,
} from '../../constants/actionTypes';
import { Plan, EntityMap } from '../../types';

/**
 * In the normalized Redux store, a Plan's relations are stored as arrays of IDs
 * rather than the full nested objects that the Plan interface describes.
 */
export type NormalizedPlan = Omit<
  Plan,
  | 'pastures'
  | 'schedules'
  | 'ministerIssues'
  | 'planStatusHistory'
  | 'confirmations'
  | 'additionalRequirements'
  | 'managementConsiderations'
> & {
  pastures: number[];
  schedules: number[];
  ministerIssues: number[];
  planStatusHistory: number[];
  confirmations: number[];
  additionalRequirements: number[];
  managementConsiderations: number[];
};

export interface PlansState {
  byId: EntityMap<NormalizedPlan>;
  allIds: Array<string | number>;
}

interface PlansAction {
  type: string;
  payload: {
    entities?: { plans?: EntityMap<NormalizedPlan> };
    result?: string | number;
    plan?: NormalizedPlan;
    planId?: string | number;
    schedules?: number[];
    planStatusHistory?: number[];
    managementConsideration?: { id: number };
    considerationId?: number;
  };
}

const initialState: PlansState = {
  byId: {},
  allIds: [],
};

const storePlan = (state: PlansState, action: PlansAction): PlansState => {
  const { entities, result: planId } = action.payload;
  const plans = entities?.plans ?? {};
  const handlePlanIds = (state: PlansState, planId: string | number): Array<string | number> => {
    if (state.allIds.find((id) => id === planId)) {
      return [...state.allIds];
    }
    return [...state.allIds, planId];
  };

  return {
    byId: {
      ...state.byId,
      ...plans,
    },
    allIds: handlePlanIds(state, planId!),
  };
};

const updatePlan = (state: PlansState, action: PlansAction): PlansState => {
  const { plan } = action.payload;
  return {
    ...state,
    byId: {
      ...state.byId,
      [plan!.id]: plan!,
    },
  };
};

const addSchedule = (state: PlansState, action: PlansAction): PlansState => {
  const { planId, schedules } = action.payload;
  const plan: NormalizedPlan = {
    ...state.byId[planId!],
    schedules: schedules!,
  };

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId!]: plan,
    },
  };
};

const deleteSchedule = (state: PlansState, action: PlansAction): PlansState => {
  const { planId, schedules } = action.payload;
  const plan: NormalizedPlan = {
    ...state.byId[planId!],
    schedules: schedules!,
  };

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId!]: plan,
    },
  };
};

const addPlanStatusHistoryRecord = (state: PlansState, action: PlansAction): PlansState => {
  const { planId, planStatusHistory } = action.payload;
  const plan: NormalizedPlan = {
    ...state.byId[planId!],
    planStatusHistory: planStatusHistory!,
  };

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId!]: plan,
    },
  };
};

const addManagementConsideration = (state: PlansState, action: PlansAction): PlansState => {
  const { planId, managementConsideration } = action.payload;
  const plan = { ...state.byId[planId!] };
  plan.managementConsiderations = [...plan.managementConsiderations, managementConsideration!.id];

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId!]: plan,
    },
  };
};

const deleteManagementConsideration = (state: PlansState, action: PlansAction): PlansState => {
  const { planId, considerationId } = action.payload;
  const plan = { ...state.byId[planId!] };
  plan.managementConsiderations = plan.managementConsiderations.filter((c) => c !== considerationId);

  return {
    ...state,
    byId: {
      ...state.byId,
      [planId!]: plan,
    },
  };
};

const plansReducer = (state: PlansState = initialState, action: PlansAction): PlansState => {
  switch (action.type) {
    case STORE_PLAN:
      return storePlan(state, action);
    case PLAN_UPDATED:
      return updatePlan(state, action);
    case SCHEDULE_ADDED:
      return addSchedule(state, action);
    case SCHEDULE_DELETED:
      return deleteSchedule(state, action);
    case PLAN_STATUS_HISTORY_RECORD_ADDED:
      return addPlanStatusHistoryRecord(state, action);
    case MANAGEMENT_CONSIDERATION_ADDED:
      return addManagementConsideration(state, action);
    case MANAGEMENT_CONSIDERATION_DELETED:
      return deleteManagementConsideration(state, action);
    default:
      return state;
  }
};

export default plansReducer;
