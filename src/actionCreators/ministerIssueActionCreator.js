import * as API from '../constants/api';
import { axios, createConfigWithHeader } from '../utils';

export const createRUPMinisterIssueAction = (planId, issueId, action) => (dispatch, getState) => {
  return axios.post(
    API.CREATE_RUP_MINISTER_ISSUE_ACTION(planId, issueId),
    action,
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      throw err;
    },
  );
};

export const createRUPMinisterIssueAndActions = (planId, issue) => (dispatch, getState) => {
  const makeRequest = async () => {
    try {
      const { data: newIssue } = await axios.post(
        API.CREATE_RUP_MINISTER_ISSUE(planId),
        issue,
        createConfigWithHeader(getState),
      );
      const newActions = await Promise.all(issue.ministerIssueActions
        .map(mia => dispatch(createRUPMinisterIssueAction(planId, newIssue.id, mia))));

      return {
        ...newIssue,
        ministerIssueActions: newActions,
      };
    } catch (err) {
      throw err;
    }
  };

  return makeRequest();
};

export const deleteRUPMinisterIssue = (planId, issueId) => (dispatch, getState) => {
  return axios.delete(
    API.DELETE_RUP_MINISTER_ISSUE(planId, issueId),
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      throw err;
    },
  );
};

export const deleteRUPMinisterIssueAction = (planId, issueId, actionId) => (dispatch, getState) => {
  return axios.delete(
    API.DELETE_RUP_MINISTER_ISSUE_ACTION(planId, issueId, actionId),
    createConfigWithHeader(getState),
  ).then(
    (response) => {
      return response.data;
    },
    (err) => {
      throw err;
    },
  );
};
