import { STORE_PLAN, UPDATE_MINISTER_ISSUE } from '../../constants/actionTypes';

const storeMinisterIssues = (state, action) => {
  const { ministerIssues } = action.payload.entities;

  return {
    ...state,
    ...ministerIssues,
  };
};

const updateMinisterissue = (state, action) => {
  const { ministerIssue } = action.payload;

  return {
    ...state,
    [ministerIssue.id]: ministerIssue,
  };
};

const ministerIssuesReducer = (state = {}, action) => {
  switch (action.type) {
    case STORE_PLAN:
      return storeMinisterIssues(state, action);
    case UPDATE_MINISTER_ISSUE:
      return updateMinisterissue(state, action);
    default:
      return state;
  }
};

export default ministerIssuesReducer;
