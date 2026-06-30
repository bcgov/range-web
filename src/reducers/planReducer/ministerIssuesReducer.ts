import { STORE_PLAN } from '../../constants/actionTypes';
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

const ministerIssuesReducer = (state: MinisterIssuesState = {}, action: MinisterIssueAction): MinisterIssuesState => {
  switch (action.type) {
    case STORE_PLAN:
      return storeMinisterIssues(state, action);
    default:
      return state;
  }
};

export default ministerIssuesReducer;
