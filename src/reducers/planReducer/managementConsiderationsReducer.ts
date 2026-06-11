import {
  STORE_PLAN,
  MANAGEMENT_CONSIDERATION_ADDED,
  MANAGEMENT_CONSIDERATION_UPDATED,
} from '../../constants/actionTypes';
import { ManagementConsideration, EntityMap } from '../../types';

export type ManagementConsiderationsState = EntityMap<ManagementConsideration>;

interface ManagementConsiderationAction {
  type: string;
  payload: {
    entities?: { managementConsiderations?: EntityMap<ManagementConsideration> };
    managementConsideration?: ManagementConsideration;
  };
}

const storeManagementConsiderations = (
  state: ManagementConsiderationsState,
  action: ManagementConsiderationAction,
): ManagementConsiderationsState => {
  const managementConsiderations = action.payload.entities?.managementConsiderations ?? {};

  return {
    ...state,
    ...managementConsiderations,
  };
};

const addManagementConsideration = (
  state: ManagementConsiderationsState,
  action: ManagementConsiderationAction,
): ManagementConsiderationsState => {
  const { managementConsideration } = action.payload;

  return {
    ...state,
    [managementConsideration!.id]: managementConsideration!,
  };
};

const updateManagementConsideration = (
  state: ManagementConsiderationsState,
  action: ManagementConsiderationAction,
): ManagementConsiderationsState => {
  const { managementConsideration } = action.payload;

  return {
    ...state,
    [managementConsideration!.id]: managementConsideration!,
  };
};

const managementConsiderationsReducer = (
  state: ManagementConsiderationsState = {},
  action: ManagementConsiderationAction,
): ManagementConsiderationsState => {
  switch (action.type) {
    case STORE_PLAN:
      return storeManagementConsiderations(state, action);
    case MANAGEMENT_CONSIDERATION_ADDED:
      return addManagementConsideration(state, action);
    case MANAGEMENT_CONSIDERATION_UPDATED:
      return updateManagementConsideration(state, action);
    default:
      return state;
  }
};

export default managementConsiderationsReducer;
