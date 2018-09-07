import { STORE_PLAN } from '../constants/actionTypes';

const storeMinisterIssue = (state, action) => {
  const { ministerIssues } = action.payload.entities;

  return {
    ...state,
    ...ministerIssues,
  };
};
const ministerIssuesReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeMinisterIssue(state, action);
    default:
      return state;
  }
};

export default ministerIssuesReducer;
