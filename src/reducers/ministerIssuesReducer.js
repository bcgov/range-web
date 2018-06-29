import { STORE_PLAN } from '../constants/actionTypes';

const storeMinisterIssue = (state, action) => {
  const { ministerIssues } = action.payload.entities;

  return {
    byId: {
      ...state.byId,
      ...ministerIssues,
    },
  };
};
const ministerIssuesReducer = (state = {
  byId: {},
}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeMinisterIssue(state, action);
    default:
      return state;
  }
};

export default ministerIssuesReducer;