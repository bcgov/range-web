import { STORE_PLAN, MINISTER_ISSUE_UPDATED } from '../../constants/actionTypes';

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
    case MINISTER_ISSUE_UPDATED:
      return updateMinisterissue(state, action);
    default:
      return state;
  }
};

export default ministerIssuesReducer;
