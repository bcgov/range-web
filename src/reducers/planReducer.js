import { STORE_PLAN } from '../constants/actionTypes';

const initialState = {
  plans: {},
  planIds: [],
  pastures: {},
  grazingSchedules: {},
  ministerIssues: {},
};

const storePlan = (state, action) => {
  const { entities, result } = action.payload;
  const { plans } = entities;
  return {
    ...state,
  };
};
