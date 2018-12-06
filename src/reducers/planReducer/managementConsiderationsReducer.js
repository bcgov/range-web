import { STORE_PLAN } from '../../constants/actionTypes';

const storeManagementConsiderations = (state, action) => {
  const { managementConsiderations } = action.payload.entities;

  return {
    ...state,
    ...managementConsiderations,
  };
};

const managementConsiderationsReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeManagementConsiderations(state, action);
    default:
      return state;
  }
};

export default managementConsiderationsReducer;
