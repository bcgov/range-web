import { STORE_PLAN, MANAGEMENT_CONSIDERATION_UPDATED } from '../../constants/actionTypes';

const storeManagementConsiderations = (state, action) => {
  const { managementConsiderations } = action.payload.entities;

  return {
    ...state,
    ...managementConsiderations,
  };
};

const updateManagementConsideration = (state, action) => {
  const { managementConsideration } = action.payload;

  return {
    ...state,
    [managementConsideration.id]: managementConsideration,
  };
};

const managementConsiderationsReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeManagementConsiderations(state, action);
    case MANAGEMENT_CONSIDERATION_UPDATED:
      return updateManagementConsideration(state, action);
    default:
      return state;
  }
};

export default managementConsiderationsReducer;
