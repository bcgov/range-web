import { STORE_PLAN, MINISTER_ISSUE_UPDATED } from '../../constants/actionTypes';
import { MinisterIssue, EntityMap } from '../../types';

export type MinisterIssuesState = EntityMap<MinisterIssue>;

interface MinisterIssueAction {
  type: string;
  payload: {
    entities?: { ministerIssues?: EntityMap<MinisterIssue> };
    ministerIssue?: MinisterIssue;
  };
}

const storeMinisterIssues = (state: MinisterIssuesState, action: MinisterIssueAction): MinisterIssuesState => {
  const ministerIssues = action.payload.entities?.ministerIssues ?? {};

  return {
    ...state,
    ...ministerIssues,
  };
};

const updateMinisterIssue = (state: MinisterIssuesState, action: MinisterIssueAction): MinisterIssuesState => {
  const { ministerIssue } = action.payload;

  return {
    ...state,
    [ministerIssue!.id]: ministerIssue!,
  };
};

const ministerIssuesReducer = (state: MinisterIssuesState = {}, action: MinisterIssueAction): MinisterIssuesState => {
  switch (action.type) {
    case STORE_PLAN:
      return storeMinisterIssues(state, action);
    case MINISTER_ISSUE_UPDATED:
      return updateMinisterIssue(state, action);
    default:
      return state;
  }
};

export default ministerIssuesReducer;
